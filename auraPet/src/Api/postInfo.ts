// aquí van las acciones que CREAN o CAMBIAN datos en la base (los "POST").
import type { DatosNuevaMascota, DatosNuevoCentro, DatosNuevoDueno, DatosNuevoProfesional, DatosNuevoSuperadmin } from "../interfaces";
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
