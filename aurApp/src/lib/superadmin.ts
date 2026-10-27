import type { FiltroAprobaciones, FiltroMensajes, MensajeContacto, SolicitudPendiente } from '@/interfaces';

// Filtros del panel del superadmin (definidos fuera de los componentes para useFiltro).

export const FILTROS_SOLICITUD: Record<FiltroAprobaciones, (s: SolicitudPendiente) => boolean> = {
  todas: () => true,
  centro: (s) => s.tipo === 'centro',
  veterinario: (s) => s.tipo === 'veterinario',
  solicitud_centro: (s) => s.tipo === 'solicitud_centro',
};

export const camposBusquedaSolicitud = (s: SolicitudPendiente) => [s.nombre, s.detalle];

export const FILTROS_MENSAJE: Record<FiltroMensajes, (m: MensajeContacto) => boolean> = {
  pendiente: (m) => m.estado === 'pendiente',
  respondido: (m) => m.estado === 'respondido',
  cerrado: (m) => m.estado === 'cerrado',
};

export const camposBusquedaMensaje = (m: MensajeContacto) => [m.nombre, m.correo, m.asunto, m.mensaje];
