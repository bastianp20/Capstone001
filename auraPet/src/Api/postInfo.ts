// aquí van las acciones que CREAN o CAMBIAN datos en la base (los "POST").
import type { DatosNuevaMascota, DatosNuevoCentro, DatosNuevoDueno, DatosNuevoProfesional, DatosNuevoSuperadmin, DatosEdicionCentro, DatosNuevoAdministrativo, CambioCita, DatosSolicitudCita, CambiosCuenta, NuevoRegistroMedico, CambiosDatosClinicos, DatosSolicitudCentro, NuevaReceta, NuevaDerivacion, DatosContacto, EstadoContacto, DatosNota } from "../interfaces";
import { supabase } from "../lib/supabase";
import type { Json } from "../lib/database.types";


// Crea un veterinario llamando a la edge Function "crear-profesional" que está en la base de datos. la función se encarga de generar la contraseña temporal y 
// de crear el registro en la tabla veterinarios. la función devuelve la contraseña temporal para que el superAdmin pueda mostrarsela al usuario
// supabase-js manda solo el token del superadmin conectado; la función
// revisa que sea superadmin antes de crear nada, ya que solo el superAdmin PUEDE CREAR UN PROFESIONAL
// luegos los mismos veterinarios pueden crear sus propias cuentas, pero no pueden crear otras cuentas de veterinarios ni de centro
// ese trabajo es exclusivo del superAdmin.
export const crearProfesional = async (datos: DatosNuevoProfesional) => {
  const { data, error } = await supabase.functions.invoke<{ ok: boolean }>(
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

  // Solicitud desde /solicitar-centro: la resuelve la base (migración 21),
  // que además crea el centro si se aprueba.
  if (tipo === "solicitud_centro") {
    const { error } = await supabase.rpc("resolver_solicitud_centro", {
      p_solicitud_id: Number(id),
      p_decision: decision,
      p_motivo: decision === "rechazado" ? motivo?.trim() : undefined,
    });
    if (error) throw new Error(error.message || "No se pudo resolver la solicitud.");
    return;
  }

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
      // es_prueba solo se manda si viene (lo cambia el superadmin; la migración 16
      // no deja cambiarlo si el equipo del centro es del otro "mundo")
      ...(datos.esPrueba !== undefined && { es_prueba: datos.esPrueba }),
    })
    .eq("id", centroId)
    .select("id");
  if (error) throw new Error(error.message || "No se pudieron guardar los cambios.");
  // Sin filas devueltas = la base no dejó editar (no es admin de ese centro)
  if (!data?.length) throw new Error("No tienes permiso para editar este centro.");
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

// RECHAZAR UNA SOLICITUD DE CITA (VETERINARIO)
// La función rechazar_cita de la base (migración 18) revisa que la
// cita sea de este veterinario y que siga pendiente. La deja "cancelada",
// con cancelada_por = el veterinario y la razón en motivo_cancelacion.
export const rechazarCita = async (citaId: number, motivo: string) => {
  const { error } = await supabase.rpc("rechazar_cita", { p_cita_id: citaId, p_motivo: motivo.trim() });
  if (error) throw new Error(error.message || "No se pudo rechazar la cita.");
};

// AGREGAR UN REGISTRO AL HISTORIAL (VETERINARIO TRATANTE)
// agregar_registro_medico (migración 19) pone el veterinario y el centro,
// y revisa que la mascota sea su paciente. Los registros no se editan.
export const agregarRegistroMedico = async (registro: NuevoRegistroMedico) => {
  const { error } = await supabase.rpc("agregar_registro_medico", {
    p_mascota_id: registro.mascotaId,
    p_tipo: registro.tipo,
    p_fecha: registro.fecha,
    p_descripcion: registro.descripcion.trim(),
    p_tratamiento: registro.tratamiento.trim() || undefined,
    p_proxima_dosis: registro.proximaDosis || undefined,
  });
  if (error) throw new Error(error.message || "No se pudo guardar el registro.");
};

// ACTUALIZAR DATOS CLÍNICOS DE UN PACIENTE (VETERINARIO TRATANTE)
// actualizar_datos_clinicos (migración 19): un texto vacío borra el dato.
export const actualizarDatosClinicos = async (mascotaId: number, cambios: CambiosDatosClinicos) => {
  const { error } = await supabase.rpc("actualizar_datos_clinicos", {
    p_mascota_id: mascotaId,
    p_peso_kg: cambios.pesoKg ?? undefined,
    p_alergias: cambios.alergias,
    p_condiciones_cronicas: cambios.condicionesCronicas,
    p_esterilizado: cambios.esterilizado,
    p_microchip: cambios.microchip,
  });
  if (error) throw new Error(error.message || "No se pudieron guardar los datos clínicos.");
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

// SOLICITAR UNIRSE COMO CENTRO (página pública, sin cuenta)
// solicitar_centro (migración 20) valida todo y no deja dos solicitudes
// pendientes con el mismo correo. Su mensaje de error llega tal cual.
export const solicitarCentro = async (datos: DatosSolicitudCentro) => {
  const { error } = await supabase.rpc("solicitar_centro", {
    p_nombre_centro: datos.nombreCentro.trim(),
    p_direccion: datos.direccion.trim(),
    p_comuna: datos.comuna.trim(),
    p_telefono_centro: Number(datos.telefonoCentro.replace(/\D/g, "")),
    p_especialidad_ids: datos.especialidadIds,
    p_sitio_web: datos.sitioWeb.trim() || undefined,
    p_nombre_responsable: datos.nombreResponsable.trim(),
    p_cargo: datos.cargo,
    p_correo: datos.correo.trim(),
    p_telefono_responsable: Number(datos.telefonoResponsable.replace(/\D/g, "")),
    p_mensaje: datos.mensaje.trim() || undefined,
  });
  if (error) throw new Error(error.message || "No se pudo enviar la solicitud.");
};

// SOLICITAR UN CAMBIO DE PLAN (ADMIN DEL CENTRO)
// solicitar_cambio_plan (migración 24): deja la solicitud para el superadmin
// y la anota en el historial. No cobra nada.
export const solicitarCambioPlan = async (centroId: number, planId: string, mensaje: string) => {
  const { error } = await supabase.rpc("solicitar_cambio_plan", {
    p_centro_id: centroId,
    p_plan_id: planId,
    p_mensaje: mensaje.trim() || undefined,
  });
  if (error) throw new Error(error.message || "No se pudo enviar la solicitud.");
};

// GUARDAR UNA RECETA (VETERINARIO TRATANTE)
// crear_receta (migración 27) guarda la receta y sus medicamentos juntos.
export const crearReceta = async (receta: NuevaReceta): Promise<number> => {
  const { data, error } = await supabase.rpc("crear_receta", {
    p_mascota_id: receta.mascotaId,
    p_medicamentos: receta.medicamentos as unknown as Json,
    p_indicaciones: receta.indicaciones || undefined,
    p_proximo_control: receta.proximoControl || undefined,
  });
  if (error) throw new Error(error.message || "No se pudo guardar la receta.");
  return data;                                       // id de la receta (para descargarla en PDF)
};

// SUPERADMIN: activar o rechazar una solicitud de cambio de plan (migración 28).
// Al activar, el plan queda "activa" y la renovación a N meses.
export const resolverSolicitudPlan = async (solicitudId: number, aprobar: boolean, meses?: number) => {
  const { error } = await supabase.rpc("resolver_solicitud_plan", { p_solicitud_id: solicitudId, p_aprobar: aprobar, p_meses: meses });
  if (error) throw new Error(error.message || "No se pudo resolver la solicitud de plan.");
};

// SUPERADMIN: sumar días a la prueba o a la renovación de un centro.
export const extenderSuscripcion = async (centroId: number, dias: number) => {
  const { error } = await supabase.rpc("extender_suscripcion", { p_centro_id: centroId, p_dias: dias });
  if (error) throw new Error(error.message || "No se pudo extender la suscripción.");
};

// DERIVAR UN PACIENTE (migración 29): a un veterinario o a un centro.
// La base agrega el registro al historial y valida que sea tu paciente.
export const crearDerivacion = async ({ mascotaId, destino, motivo }: NuevaDerivacion) => {
  const { error } = await supabase.rpc("crear_derivacion", {
    p_mascota_id: mascotaId,
    p_motivo: motivo.trim(),
    p_a_veterinario_id: destino.tipo === "veterinario" ? destino.id : undefined,
    p_a_centro_id: destino.tipo === "centro" ? destino.id : undefined,
  });
  if (error) throw new Error(error.message || "No se pudo derivar al paciente.");
};

// realizada = true: el destino la cierra con el resultado.
// realizada = false: el destino la rechaza o quien derivó la cancela.
export const responderDerivacion = async (derivacionId: number, realizada: boolean, resultado?: string) => {
  const { error } = await supabase.rpc("responder_derivacion", {
    p_derivacion_id: derivacionId,
    p_realizada: realizada,
    p_resultado: resultado?.trim() || undefined,
  });
  if (error) throw new Error(error.message || "No se pudo actualizar la derivación.");
};

// FORMULARIO DE CONTACTO (público). Entra como 'pendiente' (política de la
// migración 02) y le llega al superadmin en "Mensajes". Sin .select():
// quien escribe (anon) no puede leer la tabla.
export const enviarMensajeContacto = async (datos: DatosContacto) => {
  const { error } = await supabase.from("mensajes_contacto").insert({
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim().toLowerCase(),
    asunto: datos.asunto,
    mensaje: datos.mensaje.trim(),
  });
  if (error) throw new Error("No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.");
};

// SUPERADMIN: cambia el estado de un mensaje (pendiente / respondido / cerrado)
export const cambiarEstadoMensaje = async (mensajeId: number, estado: EstadoContacto) => {
  const { error } = await supabase.from("mensajes_contacto").update({ estado }).eq("id", mensajeId);
  if (error) throw new Error(error.message || "No se pudo actualizar el mensaje.");
};

// ---------- ELIMINACIÓN DE CUENTA (migración 32) ----------
// Pedir que se elimine (desactive) la propia cuenta
export const solicitarEliminacionCuenta = async (motivo: string) => {
  const { error } = await supabase.rpc("solicitar_eliminacion_cuenta", { p_motivo: motivo.trim() || undefined });
  if (error) throw new Error(error.message || "No se pudo enviar la solicitud.");
};

// SUPERADMIN: aprobar (desactiva la cuenta) o rechazar con una respuesta
export const resolverSolicitudEliminacion = async (solicitudId: number, aprobar: boolean, respuesta?: string) => {
  const { error } = await supabase.rpc("resolver_solicitud_eliminacion", {
    p_solicitud_id: solicitudId,
    p_aprobar: aprobar,
    p_respuesta: respuesta?.trim() || undefined,
  });
  if (error) throw new Error(error.message || "No se pudo resolver la solicitud.");
};

// ---------- NOTAS PERSONALES (migración 33) ----------
// perfil_id lo pone la base (default auth.uid()) y RLS deja tocar solo las propias
export const crearNota = async (datos: DatosNota) => {
  const { error } = await supabase.from("notas").insert({
    titulo: datos.titulo.trim(),
    contenido: datos.contenido.trim(),
    color: datos.color,
  });
  if (error) throw new Error(error.message || "No se pudo guardar la nota.");
};

export const actualizarNota = async (notaId: number, cambios: Partial<DatosNota> & { fijada?: boolean }) => {
  const fila = {
    ...cambios,
    ...(cambios.titulo !== undefined ? { titulo: cambios.titulo.trim() } : {}),
    ...(cambios.contenido !== undefined ? { contenido: cambios.contenido.trim() } : {}),
  };
  const { error } = await supabase.from("notas").update(fila).eq("id", notaId);
  if (error) throw new Error(error.message || "No se pudo actualizar la nota.");
};

export const borrarNota = async (notaId: number) => {
  const { error } = await supabase.from("notas").delete().eq("id", notaId);
  if (error) throw new Error(error.message || "No se pudo borrar la nota.");
};
