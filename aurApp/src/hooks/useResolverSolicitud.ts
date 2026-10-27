import { useState } from 'react';

import { resolverSolicitud } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { TEXTOS_APROBACIONES as T } from '@/constants/constants';
import { useSuperadmin } from '@/context/SuperadminContext';
import type { SolicitudPendiente } from '@/interfaces';
import { confirmar } from '@/lib/confirmar';

import { useAccion } from './useAccion';

/** Aprobar (con confirmación) o rechazar (con motivo) una solicitud. Lo usan Resumen y Aprobaciones. */
export function useResolverSolicitud() {
  const { usuarioActual } = useAuth();
  const { recargar } = useSuperadmin();
  const accion = useAccion();
  const modal = useAccion();
  const [ocupadaClave, setOcupadaClave] = useState<string | null>(null);
  const [rechazando, setRechazando] = useState<SolicitudPendiente | null>(null);

  const aprobar = async (s: SolicitudPendiente) => {
    if (!usuarioActual) return;
    const seguro = await confirmar({ titulo: T.confirmarAprobarTitulo, mensaje: T.confirmarAprobarTexto(s.nombre), textoSi: T.si, textoNo: T.no });
    if (!seguro) return;
    setOcupadaClave(s.clave);
    const ok = await accion.ejecutar(() => resolverSolicitud(s.clave, 'aprobado', usuarioActual.id), T.error);
    if (ok) await recargar();
    setOcupadaClave(null);
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
    pedirRechazo: (s: SolicitudPendiente) => {
      modal.limpiarError();
      setRechazando(s);
    },
    confirmarRechazo,
    cerrarRechazo: () => setRechazando(null),
    rechazando,
    rechazandoOcupado: modal.ocupado,
    errorRechazo: modal.error,
    ocupadaClave,
    error: accion.error,
  };
}
