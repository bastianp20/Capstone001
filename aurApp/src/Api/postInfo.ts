// Acciones que CREAN o CAMBIAN datos en la base (los "POST"). Mismo enfoque que auraPet/src/Api/postInfo.ts:
// si la base responde con error se lanza un Error con un mensaje para el usuario.
// Las funciones de la base (solicitar_cita, cancelar_mi_cita) revisan permisos y reglas por su cuenta,
// y sus mensajes ("El centro no atiende ese día") llegan tal cual.

import {
  TEXTOS_ALIADO_SOLIDARIO,
  TEXTOS_ATENCION_SOLIDARIA,
  RUTA_WEB_NUEVA_PASSWORD,
  TEXTOS_APROBACIONES,
  TEXTOS_MI_REFUGIO,
  TEXTOS_MODERACION,
  URL_WEB_AURAPET,
  BUCKET_ADOPCIONES,
  BUCKET_AVATARES,
  TEXTOS_CONCRETAR,
  TEXTOS_MIS_PUBLICACIONES,
  TEXTOS_POSTULACION,
  TEXTOS_POSTULANTES,
  TEXTOS_PUBLICAR,
  TEXTOS_REPORTE,
  PREFIJO_TELEFONO_CL,
  TEXTOS_CONTACTO,
  TEXTOS_DERIVAR_ATENCION,
  TEXTOS_ELIMINAR_CUENTA,
  TEXTOS_FOTO_PERFIL,
  TEXTOS_MASCOTA,
  TEXTOS_MIS_ESPECIALIDADES,
  TEXTOS_RECETA_ATENCION,
  TEXTOS_REGISTRO_ATENCION,
} from '@/constants/constants';
import type { Json } from '@/lib/database.types';
import type {
  DatosAtencionSolidaria,
  DecisionModeracion,
  RecepcionRefugio,
  CambiosPerfil,
  DatosPostulacionAdopcion,
  DatosPublicarAdopcion,
  MotivoReporte,
  DatosContacto,
  DatosEdicionCentro,
  DatosMascota,
  DatosSolicitudCita,
  EstadoCita,
  EstadoContacto,
  EstadoVerificacion,
  MedicamentoReceta,
  NuevaRecetaAtencion,
  NuevoRegistroAtencion,
  TipoDestinoDerivacion,
  DatosBloquearHorario,
  DatosCancelarCitaVeterinario,
  DatosEstadoUci,
  DatosHorarioAtencion,
  DatosReagendarCita,
} from '@/interfaces';
import { fechaDesdeEdad } from '@/lib/adopcion';
import { nulable } from '@/lib/argumentosRpc';
import { hoy, parsearFechaChilena } from '@/lib/fechas';
import { soloDigitos } from '@/lib/formularios';
import { supabase } from '@/lib/supabase';

const CODIGO_DUPLICADO = '23505'; // unique_violation de Postgres

// ─── Mascotas ───────────────────────────────────────────────────────────

/** Formulario → columnas de la tabla mascotas (vacío → null). */
const filaMascota = (datos: DatosMascota) => ({
  nombre: datos.nombre.trim(),
  especie: datos.especie,
  sexo: datos.sexo,
  raza: datos.raza.trim() || null,
  fecha_nacimiento: datos.fechaNacimiento.trim() ? parsearFechaChilena(datos.fechaNacimiento) : null,
  peso_kg: datos.pesoKg.trim() ? Number(datos.pesoKg.replace(',', '.')) : null,
  esterilizado: datos.esterilizado,
  alergias: datos.alergias.trim() || null,
  condiciones_cronicas: datos.condicionesCronicas.trim() || null,
  microchip: datos.microchip.trim() || null,
});

const mensajeErrorMascota = (codigo: string | undefined, porDefecto: string) =>
  codigo === CODIGO_DUPLICADO ? 'Ese número de microchip ya está registrado.' : porDefecto;

export const crearMascota = async (duenoId: string, datos: DatosMascota): Promise<number> => {
  const { data, error } = await supabase
    .from('mascotas')
    .insert({ dueno_id: duenoId, ...filaMascota(datos) })
    .select('id')
    .single();
  if (error) throw new Error(mensajeErrorMascota(error.code, TEXTOS_MASCOTA.errorCrear));
  return data.id;
};

export const editarMascota = async (mascotaId: number, datos: DatosMascota) => {
  const { data, error } = await supabase.from('mascotas').update(filaMascota(datos)).eq('id', mascotaId).select('id');
  if (error) throw new Error(mensajeErrorMascota(error.code, TEXTOS_MASCOTA.errorEditar));
  if (!data?.length) throw new Error(TEXTOS_MASCOTA.noEncontrada);
};

// ─── Citas ──────────────────────────────────────────────────────────────

/** Solicitar hora: en un centro o con un veterinario independiente (migraciones 13 y 35). */
export const solicitarCita = async (datos: DatosSolicitudCita): Promise<number> => {
  if (datos.centroId === null) {
    if (datos.veterinarioId === null) throw new Error('Elige el veterinario independiente que te atenderá.');
    const { data, error } = await supabase.rpc('solicitar_cita_independiente', {
      p_mascota_id: datos.mascotaId,
      p_veterinario_id: datos.veterinarioId,
      p_fecha_hora: datos.fechaHora,
      p_motivo: datos.motivo.trim(),
      p_sintomas: datos.sintomas,
    });
    if (error) throw new Error(error.message || 'No se pudo solicitar la hora.');
    return data;
  }
  const { data, error } = await supabase.rpc('solicitar_cita', {
    p_mascota_id: datos.mascotaId,
    p_centro_id: datos.centroId,
    p_fecha_hora: datos.fechaHora,
    p_motivo: datos.motivo.trim(),
    p_sintomas: datos.sintomas,
    p_veterinario_id: datos.veterinarioId ?? undefined,
  });
  if (error) throw new Error(error.message || 'No se pudo solicitar la hora.');
  return data;
};

/** Cancelar una cita propia: solo si está pendiente o confirmada (lo revisa la base). */
export const cancelarCita = async (citaId: number, motivo?: string) => {
  const { error } = await supabase.rpc('cancelar_mi_cita', { p_cita_id: citaId, p_motivo: motivo });
  if (error) throw new Error(error.message || 'No se pudo cancelar la cita.');
};

// ─── Perfil y contacto ──────────────────────────────────────────────────

/** Cada uno puede editar su propio perfil (política de la migración 02). El teléfono se guarda como 569XXXXXXXX. */
export const editarMiPerfil = async (perfilId: string, cambios: CambiosPerfil) => {
  const digitos = soloDigitos(cambios.telefono);
  const telefono = digitos ? Number(digitos.startsWith(PREFIJO_TELEFONO_CL) ? digitos : `${PREFIJO_TELEFONO_CL}${digitos}`) : null;
  const { data, error } = await supabase
    .from('perfiles')
    .update({ nombre: cambios.nombre.trim(), telefono })
    .eq('id', perfilId)
    .select('id');
  if (error) throw new Error(error.message || 'No se pudieron guardar tus datos.');
  if (!data?.length) throw new Error('No tienes permiso para editar esta cuenta.');
};

/** Formulario de contacto: llega al panel del superadmin (Mensajes). */
export const enviarMensajeContacto = async (datos: DatosContacto) => {
  const { error } = await supabase.from('mensajes_contacto').insert({
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim().toLowerCase(),
    asunto: datos.asunto,
    mensaje: datos.mensaje.trim(),
  });
  if (error) throw new Error(TEXTOS_CONTACTO.error);
};

// =====================================================================
// VETERINARIO
// =====================================================================

/** Avanzar el estado de una cita propia: confirmar, iniciar o terminar (actualizar_mi_cita, migración 12). */
export const actualizarMiCita = async (citaId: number, estado: EstadoCita) => {
  const { error } = await supabase.rpc('actualizar_mi_cita', { p_cita_id: citaId, p_estado: estado });
  if (error) throw new Error(error.message || 'No se pudo actualizar la cita.');
};

/** Rechazar una solicitud pendiente: queda cancelada con el motivo para el dueño (migración 18). */
export const rechazarCita = async (citaId: number, motivo: string) => {
  const { error } = await supabase.rpc('rechazar_cita', { p_cita_id: citaId, p_motivo: motivo.trim() });
  if (error) throw new Error(error.message || 'No se pudo rechazar la cita.');
};

/** realizada = true: se cierra con el resultado. false: se rechaza o se cancela (migración 29). */
export const responderDerivacion = async (derivacionId: number, realizada: boolean, resultado?: string) => {
  const { error } = await supabase.rpc('responder_derivacion', {
    p_derivacion_id: derivacionId,
    p_realizada: realizada,
    p_resultado: resultado?.trim() || undefined,
  });
  if (error) throw new Error(error.message || 'No se pudo actualizar la derivación.');
};

// =====================================================================
// ADMINISTRADOR DE CENTRO
// =====================================================================

/** Editar los datos del centro (la política solo deja al admin de ese centro o al superadmin). */
export const actualizarCentro = async (centroId: number, datos: DatosEdicionCentro) => {
  const { data, error } = await supabase
    .from('centros')
    .update({
      nombre: datos.nombre.trim(),
      direccion: datos.direccion.trim(),
      comuna: datos.comuna.trim(),
      telefono: soloDigitos(datos.telefono) ? Number(soloDigitos(datos.telefono)) : null,
    })
    .eq('id', centroId)
    .select('id');
  if (error) throw new Error(error.message || 'No se pudieron guardar los cambios.');
  if (!data?.length) throw new Error('No tienes permiso para editar este centro.');
};

/** Pedir un cambio de plan: lo activa el superadmin a mano (migración 24). */
export const solicitarCambioPlan = async (centroId: number, planId: string, mensaje: string) => {
  const { error } = await supabase.rpc('solicitar_cambio_plan', {
    p_centro_id: centroId,
    p_plan_id: planId,
    p_mensaje: mensaje.trim() || undefined,
  });
  if (error) throw new Error(error.message || 'No se pudo enviar la solicitud.');
};

// =====================================================================
// SUPERADMIN
// =====================================================================

/** Aprobar o rechazar una solicitud. La clave viene como "centro-3", "veterinario-5" o "solicitud_centro-2". */
export const resolverSolicitud = async (
  clave: string,
  decision: Exclude<EstadoVerificacion, 'pendiente'>,
  revisadoPor: string,
  motivo?: string,
) => {
  const separador = clave.lastIndexOf('-');
  const tipo = clave.slice(0, separador);
  const id = Number(clave.slice(separador + 1));

  // Solicitud desde /solicitar-centro: la resuelve la base y crea el centro si se aprueba (migración 21).
  if (tipo === 'solicitud_centro') {
    const { error } = await supabase.rpc('resolver_solicitud_centro', {
      p_solicitud_id: id,
      p_decision: decision,
      p_motivo: decision === 'rechazado' ? motivo?.trim() : undefined,
    });
    if (error) throw new Error(error.message || 'No se pudo resolver la solicitud.');
    return;
  }

  const cambios = {
    estado_verificacion: decision,
    revisado_por: revisadoPor,
    revisado_en: new Date().toISOString(),
    motivo_rechazo: decision === 'rechazado' ? motivo?.trim() || null : null,
  };
  const { data, error } =
    tipo === 'centro'
      ? await supabase.from('centros').update(cambios).eq('id', id).select('id')
      : await supabase.from('veterinarios').update(cambios).eq('id', id).select('id');
  if (error || !data?.length) {
    throw new Error(decision === 'aprobado' ? 'No se pudo aprobar la solicitud.' : 'No se pudo rechazar la solicitud.');
  }
};

export const cambiarEstadoMensaje = async (mensajeId: number, estado: EstadoContacto) => {
  const { error } = await supabase.from('mensajes_contacto').update({ estado }).eq('id', mensajeId);
  if (error) throw new Error(error.message || 'No se pudo actualizar el mensaje.');
};

/** Aprobar (desactiva la cuenta) o rechazar con una respuesta (migración 32). */
export const resolverSolicitudEliminacion = async (solicitudId: number, aprobar: boolean, respuesta?: string) => {
  const { error } = await supabase.rpc('resolver_solicitud_eliminacion', {
    p_solicitud_id: solicitudId,
    p_aprobar: aprobar,
    p_respuesta: respuesta?.trim() || undefined,
  });
  if (error) throw new Error(error.message || 'No se pudo resolver la solicitud.');
};

/** Activar o rechazar un cambio de plan. Al activar, la renovación queda a N meses (migración 28). */
export const resolverSolicitudPlan = async (solicitudId: number, aprobar: boolean, meses = 1) => {
  const { error } = await supabase.rpc('resolver_solicitud_plan', { p_solicitud_id: solicitudId, p_aprobar: aprobar, p_meses: meses });
  if (error) throw new Error(error.message || 'No se pudo resolver la solicitud de plan.');
};

// ─── Foto de perfil (bucket "avatares", migración 44) ───────────────────

/** Sube la foto elegida (uri local del teléfono) a la carpeta propia y la deja en el perfil. Devuelve la ruta. */
export const guardarFotoPerfil = async (perfilId: string, uri: string, tipo: string, rutaAnterior: string | null): Promise<string> => {
  const bucket = supabase.storage.from(BUCKET_AVATARES);
  const extension = tipo === 'image/png' ? 'png' : tipo === 'image/webp' ? 'webp' : 'jpg';
  const ruta = `${perfilId}/avatar-${Date.now()}.${extension}`;
  const contenido = await (await fetch(uri)).arrayBuffer();
  const { error: errorSubida } = await bucket.upload(ruta, contenido, { contentType: tipo, upsert: false });
  if (errorSubida) throw new Error(TEXTOS_FOTO_PERFIL.error);
  const { error } = await supabase.from('perfiles').update({ avatar_url: ruta }).eq('id', perfilId);
  if (error) {
    await bucket.remove([ruta]);
    throw new Error(error.message || TEXTOS_FOTO_PERFIL.error);
  }
  if (rutaAnterior && !/^https?:\/\//.test(rutaAnterior)) await bucket.remove([rutaAnterior]);
  return ruta;
};

export const quitarFotoPerfil = async (perfilId: string, ruta: string | null) => {
  const { error } = await supabase.from('perfiles').update({ avatar_url: null }).eq('id', perfilId);
  if (error) throw new Error(error.message || TEXTOS_FOTO_PERFIL.error);
  if (ruta && !/^https?:\/\//.test(ruta)) await supabase.storage.from(BUCKET_AVATARES).remove([ruta]);
};

// ─── Eliminar la cuenta (migraciones 32 y 49) ───────────────────────────

export const solicitarEliminacionCuenta = async (motivo: string) => {
  const { error } = await supabase.rpc('solicitar_eliminacion_cuenta', { p_motivo: motivo.trim() });
  if (error) throw new Error(error.message || TEXTOS_ELIMINAR_CUENTA.error);
};

export const cancelarSolicitudEliminacion = async () => {
  const { error } = await supabase.rpc('cancelar_solicitud_eliminacion');
  if (error) throw new Error(error.message || TEXTOS_ELIMINAR_CUENTA.errorCancelar);
};

// ─── Atención desde el celular (fase 2) ─────────────────────────────────
// Las funciones de la base revisan que sea tu paciente (migraciones 19, 29 y 30).

export const agregarRegistroAtencion = async (r: NuevoRegistroAtencion) => {
  const { error } = await supabase.rpc('agregar_registro_medico', {
    p_cita_id: r.citaId,
    p_mascota_id: r.mascotaId,
    p_tipo: r.tipo,
    p_fecha: r.fecha,
    p_descripcion: r.descripcion.trim(),
    p_tratamiento: r.tratamiento.trim() || undefined,
    p_proxima_dosis: r.proximaDosis ?? undefined,
  });
  if (error) throw new Error(error.message || TEXTOS_REGISTRO_ATENCION.error);
};

/** Solo el peso: los demás datos clínicos quedan como estaban. */
export const actualizarPesoPaciente = async (mascotaId: number, pesoKg: number) => {
  const { error } = await supabase.rpc('actualizar_datos_clinicos', { p_mascota_id: mascotaId, p_peso_kg: pesoKg });
  if (error) throw new Error(error.message || TEXTOS_REGISTRO_ATENCION.error);
};

/** Devuelve el id de la receta (para armar su PDF). */
export const crearRecetaAtencion = async (r: NuevaRecetaAtencion): Promise<number> => {
  const medicamentos: MedicamentoReceta[] = r.medicamentos.map((m) => ({
    nombre: m.nombre.trim(),
    dosis: m.dosis.trim(),
    frecuencia: m.frecuencia.trim(),
    duracion: m.duracion.trim(),
  }));
  const { data, error } = await supabase.rpc('crear_receta', {
    p_cita_id: r.citaId,
    p_mascota_id: r.mascotaId,
    p_medicamentos: medicamentos as unknown as Json,
    p_indicaciones: r.indicaciones.trim() || undefined,
    p_proximo_control: r.proximoControl ?? undefined,
  });
  if (error) throw new Error(error.message || TEXTOS_RECETA_ATENCION.error);
  return data;
};

export const crearDerivacion = async (mascotaId: number, destino: { tipo: TipoDestinoDerivacion; id: number }, motivo: string) => {
  const { error } = await supabase.rpc('crear_derivacion', {
    p_mascota_id: mascotaId,
    p_motivo: motivo.trim(),
    p_a_veterinario_id: destino.tipo === 'veterinario' ? destino.id : undefined,
    p_a_centro_id: destino.tipo === 'centro' ? destino.id : undefined,
  });
  if (error) throw new Error(error.message || TEXTOS_DERIVAR_ATENCION.error);
};

/** Deja exactamente las marcadas (sin límite); la primera queda como principal (migración 45). */
export const guardarMisEspecialidades = async (ids: number[], otra: string) => {
  const { error } = await supabase.rpc('guardar_especialidades_veterinario', { p_ids: ids, p_otra: otra.trim() });
  if (error) throw new Error(error.message || TEXTOS_MIS_ESPECIALIDADES.error);
};

// ─── Adopción (Fase 3; las mismas reglas que la web) ────────────────────

/** "Quiero adoptarlo": la base revisa que esté disponible, que no sea tuyo y que no hayas postulado antes. */
export const postularAdopcion = async (adopcionId: number, d: DatosPostulacionAdopcion): Promise<number> => {
  const { data, error } = await supabase.rpc('postular_adopcion', {
    p_adopcion_id: adopcionId,
    p_vivienda: d.vivienda ?? '',
    p_tiene_patio: !!d.tienePatio,
    p_tenencia: d.tenencia ?? '',
    p_permiten_mascotas: !!d.permitenMascotas,
    p_hay_ninos: !!d.hayNinos,
    p_edades_ninos: d.hayNinos ? d.edadesNinos.trim() : '',
    p_otras_mascotas: !!d.otrasMascotas,
    p_cuales_mascotas: d.otrasMascotas ? d.cualesMascotas.trim() : '',
    p_todos_de_acuerdo: !!d.todosDeAcuerdo,
    p_experiencia: d.experiencia.trim(),
    p_motivo: d.motivo.trim(),
  });
  if (error) throw new Error(error.message || TEXTOS_POSTULACION.error);
  return data;
};

/** Reportar una publicación. Devuelve el número del reporte. */
export const reportarAdopcion = async (adopcionId: number, motivo: MotivoReporte, comentario: string): Promise<number> => {
  const { data, error } = await supabase.rpc('reportar_adopcion', { p_adopcion_id: adopcionId, p_motivo: motivo, p_comentario: comentario.trim() });
  if (error) throw new Error(error.message || TEXTOS_REPORTE.error);
  return data;
};

/**
 * "Dar en adopción": sube las fotos (tomadas o elegidas en el teléfono) a la carpeta de quien
 * publica y crea la publicación. Si algo falla, borra las fotos que alcanzó a subir.
 */
export const publicarAdopcion = async (perfilId: string, d: DatosPublicarAdopcion): Promise<number> => {
  const bucket = supabase.storage.from(BUCKET_ADOPCIONES);
  const rutas: string[] = [];
  try {
    for (const [i, foto] of d.fotos.entries()) {
      const extension = foto.tipo === 'image/png' ? 'png' : foto.tipo === 'image/webp' ? 'webp' : 'jpg';
      const ruta = `${perfilId}/${Date.now()}-${i}.${extension}`;
      const contenido = await (await fetch(foto.uri)).arrayBuffer();
      const { error } = await bucket.upload(ruta, contenido, { contentType: foto.tipo, upsert: false });
      if (error) throw new Error(TEXTOS_PUBLICAR.error);
      rutas.push(ruta);
    }

    const { data, error } = await supabase
      .from('adopciones')
      .insert({
        publicado_por: perfilId,
        nombre: d.nombre.trim(),
        especie: d.especie ?? 'otro',
        raza: d.raza.trim() || null,
        sexo: d.sexo ?? 'macho',
        tamano: d.tamano ?? 'mediano',
        fecha_nacimiento: fechaDesdeEdad(d.anios, d.meses),
        comuna: d.comuna.trim(),
        historia: d.historia.trim() || null,
        frase: d.frase.trim() || null,
        personalidad: d.personalidad,
        energia: d.rasgos.energia,
        sociable_perros: d.rasgos.sociablePerros,
        sociable_gatos: d.rasgos.sociableGatos,
        sociable_ninos: d.rasgos.sociableNinos,
        peso_kg: d.pesoKg.trim() ? Number(d.pesoKg.replace(',', '.')) : null,
        alergias: d.alergias.trim() || null,
        vacunas_al_dia: d.vacunasAlDia,
        esterilizado: d.esterilizado,
        con_microchip: d.conMicrochip,
        solicita_chequeo: d.solicitaChequeo,
        refugio_id: d.refugioId,
        fotos: rutas,
      })
      .select('id')
      .single();
    if (error) throw new Error(error.message || TEXTOS_PUBLICAR.error);
    return data.id;
  } catch (e) {
    if (rutas.length) await bucket.remove(rutas);
    throw e;
  }
};

/** Retirar de Adopta o volver a publicar (la base deja solo a quien publicó o al equipo del refugio). */
export const cambiarEstadoPublicacion = async (adopcionId: number, estado: 'publicada' | 'retirada') => {
  const { data, error } = await supabase.from('adopciones').update({ estado }).eq('id', adopcionId).select('id');
  if (error) throw new Error(error.message || TEXTOS_MIS_PUBLICACIONES.errorAccion);
  if (!data?.length) throw new Error(TEXTOS_MIS_PUBLICACIONES.errorAccion);
};

/** Elegir (el animal pasa a "en proceso") o rechazar una postulación. */
export const responderPostulacion = async (postulacionId: number, aceptar: boolean) => {
  const { error } = await supabase.rpc('responder_postulacion', { p_postulacion_id: postulacionId, p_aceptar: aceptar });
  if (error) throw new Error(error.message || TEXTOS_POSTULANTES.errorAccion);
};

/** Cerrar la adopción. Con "traspasar", la base crea la mascota en la cuenta de quien adopta. */
export const concretarAdopcion = async (adopcionId: number, postulacionId: number, testimonio: string, traspasar: boolean) => {
  const { error } = await supabase.rpc('concretar_adopcion', {
    p_adopcion_id: adopcionId,
    p_postulacion_id: postulacionId,
    p_testimonio: testimonio.trim(),
    p_traspasar: traspasar,
  });
  if (error) throw new Error(error.message || TEXTOS_CONCRETAR.error);
};

// ─── Fase 4: refugios y moderación (superadmin) ─────────────────────────

/**
 * Aprobar un refugio. Si postuló sin cuenta, la edge function "aprobar-refugio" invita a su correo
 * (o lo vincula si ya tiene cuenta) y lo deja aprobado. Devuelve el aviso para mostrar, o null.
 */
export const aprobarRefugio = async (refugioId: number, invitarA: string | null): Promise<string | null> => {
  if (!invitarA) {
    const { error } = await supabase.rpc('verificar_refugio', { p_id: refugioId, p_aprobar: true });
    if (error) throw new Error(error.message || TEXTOS_APROBACIONES.error);
    return null;
  }
  const { data, error } = await supabase.functions.invoke<{ invitada: boolean; correo: string }>('aprobar-refugio', {
    body: { refugioId, redirigir: `${URL_WEB_AURAPET}${RUTA_WEB_NUEVA_PASSWORD}` },
  });
  if (error || !data) {
    const detalle = await (error as { context?: Response } | null)?.context?.json?.().catch(() => null);
    throw new Error(detalle?.error ?? TEXTOS_APROBACIONES.error);
  }
  return data.invitada ? TEXTOS_APROBACIONES.invitado(data.correo) : TEXTOS_APROBACIONES.vinculado(data.correo);
};

export const rechazarRefugio = async (refugioId: number) => {
  const { error } = await supabase.rpc('verificar_refugio', { p_id: refugioId, p_aprobar: false });
  if (error) throw new Error(error.message || TEXTOS_APROBACIONES.error);
};

/** Ocultar, advertir (con un mensaje para quien publicó) o descartar los reportes de una publicación. */
export const resolverModeracion = async (adopcionId: number, decision: DecisionModeracion, mensaje = '') => {
  const { error } = await supabase.rpc('resolver_moderacion', { p_adopcion_id: adopcionId, p_decision: decision, p_mensaje: mensaje.trim() });
  if (error) throw new Error(error.message || TEXTOS_MODERACION.errorAccion);
};

// ─── Fase 4: Mi refugio ─────────────────────────────────────────────────

/** Cupos ocupados o si reciben animales (lo hace quien administra; la base revisa los límites). */
export const actualizarCapacidadRefugio = async (refugioId: number, cambio: { cuposOcupados?: number; recibe?: RecepcionRefugio }) => {
  const { data, error } = await supabase
    .from('refugios')
    .update({ cupos_ocupados: cambio.cuposOcupados, recibe_animales: cambio.recibe })
    .eq('id', refugioId)
    .select('id');
  if (error) throw new Error(error.message || TEXTOS_MI_REFUGIO.errorGuardar);
  if (!data?.length) throw new Error(TEXTOS_MI_REFUGIO.errorGuardar);
};

// ─── Adopción solidaria (veterinario) ───────────────────────────────────

/**
 * Registrar una atención a un animal en adopción. La base revisa que el veterinario esté aprobado y que el
 * animal siga en adopción; además marca su ficha (vacunas, esterilización, microchip, peso) y le pone el sello.
 */
export const registrarAtencionAdopcion = async (adopcionId: number, d: DatosAtencionSolidaria): Promise<number> => {
  const monto = Number(d.monto.replace(/\D/g, ''));
  const { data, error } = await supabase.rpc('registrar_atencion_adopcion', {
    p_adopcion_id: adopcionId,
    p_centro_id: nulable(d.centroId),
    p_fecha: hoy(),
    p_estado_general: d.estadoGeneral ?? 'sano',
    p_procedimientos: ['examen_general', ...d.procedimientos],
    p_peso_kg: nulable(d.pesoKg),
    p_resumen: d.resumen.trim(),
    p_solidario: d.solidario,
    p_monto: nulable(!d.solidario && monto > 0 ? monto : null),
  });
  if (error) throw new Error(error.message || TEXTOS_ATENCION_SOLIDARIA.error);
  return data;
};

/** Mostrarse (o no) como "Aliado solidario" en Refugios. */
export const cambiarAliadoSolidario = async (activo: boolean) => {
  const { error } = await supabase.rpc('cambiar_aliado_solidario', { p_activo: activo });
  if (error) throw new Error(error.message || TEXTOS_ALIADO_SOLIDARIO.error);
};


// =====================================================================
// Horario de atención, agenda completa, UCI y urgencias (migraciones 52 a 56)
// =====================================================================

export const reagendarCitaVeterinario = async (d: DatosReagendarCita) => {
  const { error } = await supabase.rpc('reagendar_cita_veterinario', {
    p_cita_id: d.citaId, p_nueva_fecha: d.nuevaFecha, p_mensaje: d.mensaje.trim(), p_avisar_centro: d.avisarCentro,
  });
  if (error) throw new Error(error.message || 'No se pudo reagendar la cita.');
};

export const cancelarCitaVeterinario = async (d: DatosCancelarCitaVeterinario) => {
  const { error } = await supabase.rpc('cancelar_cita_veterinario', {
    p_cita_id: d.citaId, p_motivo: d.motivo.trim(), p_mensaje: d.mensaje.trim(), p_avisar_centro: d.avisarCentro,
  });
  if (error) throw new Error(error.message || 'No se pudo cancelar la cita.');
};

export const bloquearMiHorario = async (d: DatosBloquearHorario) => {
  const { error } = await supabase.rpc('bloquear_mi_horario', {
    p_desde: d.desde, p_hasta: d.hasta, p_motivo: d.motivo.trim(), p_cancelar_citas: d.cancelarCitas,
    p_mensaje: d.mensaje.trim(), p_avisar_centro: d.avisarCentro,
  });
  if (error) throw new Error(error.message || 'No se pudo bloquear el horario.');
};

export const quitarBloqueo = async (bloqueoId: number) => {
  const { error } = await supabase.rpc('quitar_bloqueo', { p_bloqueo_id: bloqueoId });
  if (error) throw new Error(error.message || 'No se pudo quitar el bloqueo.');
};

export const marcarAvisoLeido = async (avisoId: number) => {
  const { error } = await supabase.rpc('marcar_aviso_leido', { p_aviso_id: avisoId });
  if (error) throw new Error('No se pudo marcar el aviso.');
};

export const guardarMiHorarioAtencion = async (d: DatosHorarioAtencion) => {
  const { error } = await supabase.rpc('guardar_mi_horario_atencion', {
    p_tramos: d.tramos.map((t) => ({ centro_id: t.centroId, dia_semana: t.diaSemana, desde: t.desde, hasta: t.hasta })) as unknown as Json,
    p_duracion: d.duracion,
    p_urgencias_24_7: d.urgencias247,
    p_a_domicilio: d.aDomicilio,
    p_comunas: d.comunas,
  });
  if (error) throw new Error(error.message || 'No se pudo guardar el horario.');
};

export const registrarMiColegiado = async (numero: string) => {
  const { error } = await supabase.rpc('registrar_mi_colegiado', { p_numero: numero.trim() });
  if (error) throw new Error(error.message || 'No se pudo guardar el número.');
};

export const cambiarTelefonoUrgencias = async (mostrar: boolean) => {
  const { error } = await supabase.rpc('cambiar_telefono_urgencias', { p_mostrar: mostrar });
  if (error) throw new Error(error.message || 'No se pudo guardar.');
};

export const guardarHorarioCentro = async (centroId: number, horarios: { dia_semana: number; abre: string; cierra: string; inicio_colacion: string | null; fin_colacion: string | null }[]) => {
  const { error } = await supabase.rpc('guardar_horario_centro', { p_centro_id: centroId, p_horarios: horarios as unknown as Json });
  if (error) throw new Error(error.message || 'No se pudo guardar el horario.');
};

export const guardarEspecialidadesCentro = async (centroId: number, especialidadIds: number[]) => {
  const { error } = await supabase.rpc('guardar_especialidades_centro', { p_centro_id: centroId, p_especialidad_ids: especialidadIds });
  if (error) throw new Error(error.message || 'No se pudieron guardar las especialidades.');
};

export const guardarUrgenciasCentro = async (centroId: number, tieneUci: boolean, urgencias247: boolean) => {
  const { error } = await supabase.rpc('guardar_urgencias_centro', { p_centro_id: centroId, p_tiene_uci: tieneUci, p_urgencias_24_7: urgencias247 });
  if (error) throw new Error(error.message || 'No se pudo guardar.');
};

export const actualizarEstadoUci = async (centroId: number, d: DatosEstadoUci) => {
  const { error } = await supabase.rpc('actualizar_estado_uci', {
    p_centro_id: centroId,
    p_estado: d.estado,
    ...(d.motivo && { p_motivo: d.motivo }),
    ...(d.detalle.trim() && { p_detalle: d.detalle.trim() }),
  });
  if (error) throw new Error(error.message || 'No se pudo actualizar el estado de la UCI.');
};
