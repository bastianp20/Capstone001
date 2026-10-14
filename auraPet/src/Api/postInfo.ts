// aquí van las acciones que CREAN o CAMBIAN datos en la base (los "POST").
import type { DatosNuevaMascota, DatosNuevoCentro, DatosNuevoDueno, DatosNuevoProfesional, DatosNuevoSuperadmin, DatosEdicionCentro, DatosNuevoAdministrativo, CambioCita, DatosSolicitudCita, CambiosCuenta } from "../interfaces";
import { supabase } from "../lib/supabase";
import type { Json } from "../lib/database.types";


// Crea un veterinario llamando a la edge Function "crear-profesional" que está en la base de datos. la función se encarga de generar la contraseña temporal y 
// de crear el registro en la tabla veterinarios. la función devuelve la contraseña temporal para que el superAdmin pueda mostrarsela al usuario
// supabase-js manda solo el token del superadmin conectado; la función
// revisa que sea superadmin antes de crear nada, ya que solo el superAdmin PUEDE CREAR UN PROFESIONAL
// luegos los mismos veterinarios pueden crear sus propias cuentas, pero no pueden crear otras cuentas de veterinarios ni de centro
// ese trabajo es exclusivo del superAdmin.
export const crearProfesional = async (datos: DatosNuevoProfesional) => {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean; contrasenaTemporal: string }>(
    "crear-profesional",
    { body: datos }
  );

  if (error) {
    // El mensaje real que mandó la función viene dentro de error.context
    const detalle = await error.context?.json?.().catch(() => null);
    throw new Error(detalle?.error ?? "No se pudo crear el profesional.");
  }
  return data!;
};


// CREAR DUEÑO (SOLO EL SUPERADMIN PUEDE HACERLO) 
export const crearDueno = async (datos: DatosNuevoDueno) => {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean; contrasenaTemporal: string }>(
    "crear-dueno",
    { body: datos }
  );
  if (error) {
    const detalle = await error.context?.json?.().catch(() => null);
    throw new Error(detalle?.error ?? "No se pudo crear el dueño.");
  }
  return data!;
};

// CREAR SUPERADMIN (SOLO OTRO SUPERADMIN PUEDE HACERLO)
// La Edge Function crea la cuenta (nace como dueño) y en la misma llamada la sube a superadmin.
export const crearSuperadmin = async (datos: DatosNuevoSuperadmin) => {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean; contrasenaTemporal: string }>(
    "crear-superadmin",
    { body: datos }
  );
  if (error) {
    const detalle = await error.context?.json?.().catch(() => null);
    throw new Error(detalle?.error ?? "No se pudo crear el superadmin.");
  }
  return data!;
};

// CREAR CENTRO (SOLO EL SUPERADMIN)
// No necesita Edge Function: son solo filas de la base. La función de Postgres
// "crear_centro" guarda centro + horarios + especialidades en una sola transacción
// (si algo falla, no queda nada a medias). Devuelve el id del centro nuevo.
export const crearCentro = async (datos: DatosNuevoCentro) => {
  const { data, error } = await supabase.rpc("crear_centro", {
    p_nombre: datos.nombre.trim(),
    p_direccion: datos.direccion.trim(),
    p_comuna: datos.comuna.trim(),
    p_telefono: datos.telefono ? Number(datos.telefono) : undefined,
    p_es_prueba: datos.esPrueba,
    p_horarios: datos.horarios as unknown as Json,
    p_especialidad_ids: datos.especialidadIds,
  });
  if (error) throw new Error("No se pudo crear el centro.");
  return data;
};

// Crear Mascota (ésto el dueño puede hacerlo) 
export const crearMascota = async (duenoId: string, datos: DatosNuevaMascota) => {
  const { error } = await supabase.from("mascotas").insert({
    dueno_id: duenoId,
    nombre: datos.nombre.trim(),
    especie: datos.especie,
    sexo: datos.sexo,
    raza: datos.raza.trim() || null,               // vacío → null
    fecha_nacimiento: datos.fechaNacimiento || null,
    peso_kg: datos.pesoKg ? Number(datos.pesoKg) : null,
    esterilizado: datos.esterilizado,
  });
  if (error) throw new Error("No se pudo registrar la mascota.");
};


// APROBAR O RECHAZAR UNA SOLICITUD (SOLO SUPERADMIN)
// El id viene como "centro-3" o "veterinario-5" (ver getSolicitudesPendientes).
// Rechazar exige un motivo: la base no acepta un rechazo sin motivo_rechazo.
export const resolverSolicitud = async (
  idSolicitud: string,
  decision: "aprobado" | "rechazado",
  revisadoPor: string,
  motivo?: string
) => {
  const [tipo, id] = idSolicitud.split("-");
  const tabla = tipo === "centro" ? "centros" : "veterinarios";
  const { data, error } = await supabase
    .from(tabla)
    .update({
      estado_verificacion: decision,
      revisado_por: revisadoPor,
      revisado_en: new Date().toISOString(),
      motivo_rechazo: decision === "rechazado" ? motivo?.trim() || null : null,
    })
    .eq("id", Number(id))
    .select("id");
  // Si no devolvió filas, la base no dejó editarla (permisos)
  if (error || !data?.length) {
    throw new Error(decision === "aprobado" ? "No se pudo aprobar la solicitud." : "No se pudo rechazar la solicitud.");
  }
};


// ASIGNAR / QUITAR CENTROS A UN VETERINARIO (SOLO SUPERADMIN)
export const asignarCentroAVeterinario = async (veterinarioId: number, centroId: number) => {
  const { error } = await supabase
    .from("veterinario_centros")
    .insert({ veterinario_id: veterinarioId, centro_id: centroId });
  if (error) {
    // 23505 = la fila ya existe (ya estaba asignado a ese centro)
    throw new Error(error.code === "23505" ? "Ya está asignado a ese centro." : "No se pudo asignar el centro.");
  }
};

// Ojo: también borra los horarios que tenía el veterinario en ese centro.
export const quitarCentroAVeterinario = async (veterinarioId: number, centroId: number) => {
  const { data, error } = await supabase
    .from("veterinario_centros")
    .delete()
    .eq("veterinario_id", veterinarioId)
    .eq("centro_id", centroId)
    .select("centro_id");
  if (error || !data?.length) throw new Error("No se pudo quitar el centro.");
};


// EDITAR LOS DATOS DE UN CENTRO (admin de ese centro o superadmin)
// La política "el admin edita su centro; el superadmin edita todos" ya lo permite.
export const actualizarCentro = async (centroId: number, datos: DatosEdicionCentro) => {
  const { data, error } = await supabase
    .from("centros")
    .update({
      nombre: datos.nombre.trim(),
      direccion: datos.direccion.trim(),
      comuna: datos.comuna.trim(),
      telefono: datos.telefono ? Number(datos.telefono) : null,
    })
    .eq("id", centroId)
    .select("id");
  // Sin filas devueltas = la base no dejó editar (no es admin de ese centro)
  if (error || !data?.length) throw new Error("No se pudieron guardar los cambios.");
};

// CREAR CUENTA ADMINISTRATIVA (SOLO SUPERADMIN)
// La Edge Function crea la cuenta, le pone rol "administrativo" y la deja
// como admin del centro elegido, todo en la misma llamada.
export const crearAdministrativo = async (datos: DatosNuevoAdministrativo) => {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean; contrasenaTemporal: string }>(
    "crear-administrativo",
    { body: datos }
  );
  if (error) {
    const detalle = await error.context?.json?.().catch(() => null);
    throw new Error(detalle?.error ?? "No se pudo crear la cuenta administrativa.");
  }
  return data!;
};


// AVANZAR EL ESTADO O CONFIRMAR LA URGENCIA DE UNA CITA PROPIA (VETERINARIO)
// Usa la función actualizar_mi_cita de la base (migración 12): revisa que la
// cita sea del veterinario y que el paso de estado sea válido.
export const actualizarMiCita = async (citaId: number, cambio: CambioCita) => {
  const { error } = await supabase.rpc("actualizar_mi_cita", {
    p_cita_id: citaId,
    p_estado: cambio.estado,
    p_urgencia: cambio.urgencia,
  });
  if (error) throw new Error("No se pudo actualizar la cita.");
};


// SOLICITAR UNA CITA (DUEÑO)
// La función solicitar_cita de la base (migración 13) revisa todo: que la
// mascota sea suya, el horario del centro, que la hora esté libre, etc.
// Si algo no calza, su mensaje ("El centro no atiende ese día") llega tal cual.
export const solicitarCita = async (datos: DatosSolicitudCita) => {
  const { data, error } = await supabase.rpc("solicitar_cita", {
    p_mascota_id: datos.mascotaId,
    p_centro_id: datos.centroId,
    p_fecha_hora: datos.fechaHora,
    p_motivo: datos.motivo.trim(),
    p_sintomas: datos.sintomas,
    p_veterinario_id: datos.veterinarioId ?? undefined,
  });
  if (error) throw new Error(error.message || "No se pudo solicitar la cita.");
  return data;
};

// CANCELAR UNA CITA PROPIA (DUEÑO): solo si está pendiente o confirmada.
export const cancelarCita = async (citaId: number, motivo?: string) => {
  const { error } = await supabase.rpc("cancelar_mi_cita", { p_cita_id: citaId, p_motivo: motivo });
  if (error) throw new Error(error.message || "No se pudo cancelar la cita.");
};


// EDITAR UNA CUENTA (SOLO SUPERADMIN): nombre, teléfono, activar/desactivar y cuenta de prueba.
// Solo se envían los campos que cambiaron. La base revisa que quien edita sea
// superadmin y no deja desactivar al último superadmin activo.
export const editarCuenta = async (perfilId: string, cambios: CambiosCuenta) => {
  const fila: { nombre?: string; telefono?: number | null; desactivado_en?: string | null; es_prueba?: boolean } = {};
  if (cambios.nombre !== undefined) fila.nombre = cambios.nombre.trim();
  if (cambios.telefono !== undefined) fila.telefono = cambios.telefono;
  if (cambios.activa !== undefined) fila.desactivado_en = cambios.activa ? null : new Date().toISOString();
  // La base (migración 15) no deja cambiarla si la cuenta tiene centros del otro "mundo"
  if (cambios.esPrueba !== undefined) fila.es_prueba = cambios.esPrueba;

  const { data, error } = await supabase.from("perfiles").update(fila).eq("id", perfilId).select("id");
  if (error) throw new Error(error.message || "No se pudo guardar la cuenta.");
  if (!data?.length) throw new Error("No tienes permiso para editar esta cuenta.");
};
