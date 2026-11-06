import { useState } from 'react';

import { aprobarRefugio, rechazarRefugio, resolverSolicitud } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { TEXTOS_APROBACIONES as T } from '@/constants/constants';
import { useSuperadmin } from '@/context/SuperadminContext';
import type { SolicitudPendiente } from '@/interfaces';
import { confirmar } from '@/lib/confirmar';

import { useAccion } from './useAccion';

const idDeClave = (clave: string) => Number(clave.slice(clave.lastIndexOf('-') + 1));

/**
 * Aprobar (con confirmación) o rechazar una solicitud. Lo usan Resumen y Aprobaciones.
 * · Centros, veterinarios y solicitudes: se rechazan con un motivo (modal).
 * · Refugios: si postularon sin cuenta, aprobar envía la invitación; rechazar solo pide confirmar.
 */
export function useResolverSolicitud() {
  const { usuarioActual } = useAuth();
  const { recargar } = useSuperadmin();
  const accion = useAccion();
  const modal = useAccion();
  const [ocupadaClave, setOcupadaClave] = useState<string | null>(null);
  const [rechazando, setRechazando] = useState<SolicitudPendiente | null>(null);
  const [aviso, setAviso] = useState('');

  /** Ejecuta la acción sobre una tarjeta (con su "ocupado") y recarga el panel si salió bien. */
  const resolverTarjeta = async (s: SolicitudPendiente, hacer: () => Promise<unknown>) => {
    setAviso('');
    setOcupadaClave(s.clave);
    const ok = await accion.ejecutar(hacer, T.error);
    if (ok) await recargar();
    setOcupadaClave(null);
  };

  const aprobar = async (s: SolicitudPendiente) => {
    if (!usuarioActual) return;
    const mensaje = s.invitarA ? T.confirmarInvitarTexto(s.nombre, s.invitarA) : T.confirmarAprobarTexto(s.nombre);
    if (!(await confirmar({ titulo: T.confirmarAprobarTitulo, mensaje, textoSi: T.si, textoNo: T.no }))) return;
    await resolverTarjeta(s, async () => {
      if (s.tipo !== 'refugio') return resolverSolicitud(s.clave, 'aprobado', usuarioActual.id);
      const texto = await aprobarRefugio(idDeClave(s.clave), s.invitarA ?? null);
      if (texto) setAviso(texto);
    });
  };

  const pedirRechazo = async (s: SolicitudPendiente) => {
    if (s.tipo !== 'refugio') {
      modal.limpiarError();
      return setRechazando(s);
    }
    const seguro = await confirmar({ titulo: T.confirmarRechazarRefugioTitulo, mensaje: T.confirmarRechazarRefugioTexto(s.nombre), textoSi: T.siRechazar, textoNo: T.no });
    if (seguro) await resolverTarjeta(s, () => rechazarRefugio(idDeClave(s.clave)));
  };

  const confirmarRechazo = async (motivo: string) => {
    if (!rechazando || !usuarioActual) return;
    const ok = await modal.ejecutar(() => resolverSolicitud(rechazando.clave, 'rechazado', usuarioActual.id, motivo), T.error);
    if (ok) {
      setRechazando(null);
      await recargar();
    }
  };

  return {
    aprobar,
    pedirRechazo,
    confirmarRechazo,
    cerrarRechazo: () => setRechazando(null),
    rechazando,
    rechazandoOcupado: modal.ocupado,
    errorRechazo: modal.error,
    ocupadaClave,
    error: accion.error,
    aviso,
  };
}
