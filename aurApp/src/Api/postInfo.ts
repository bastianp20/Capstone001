// Acciones que CREAN o CAMBIAN datos en la base (los "POST"). Mismo enfoque que auraPet/src/Api/postInfo.ts:
// si la base responde con error se lanza un Error con un mensaje para el usuario.
// Las funciones de la base (solicitar_cita, cancelar_mi_cita) revisan permisos y reglas por su cuenta,
// y sus mensajes ("El centro no atiende ese día") llegan tal cual.

import { PREFIJO_TELEFONO_CL, TEXTOS_CONTACTO, TEXTOS_MASCOTA } from '@/constants/constants';
import type {
  CambiosPerfil,
  DatosContacto,
  DatosEdicionCentro,
  DatosMascota,
  DatosSolicitudCita,
  EstadoCita,
  EstadoContacto,
  EstadoVerificacion,
} from '@/interfaces';
import { parsearFechaChilena } from '@/lib/fechas';
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
