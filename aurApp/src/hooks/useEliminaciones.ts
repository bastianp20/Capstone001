import { useState } from 'react';

import { resolverSolicitudEliminacion } from '@/Api/postInfo';
import { TEXTOS_ELIMINACIONES as T } from '@/constants/constants';
import { useSuperadmin } from '@/context/SuperadminContext';
import type { SolicitudEliminacion } from '@/interfaces';
import { confirmar } from '@/lib/confirmar';

import { useAccion } from './useAccion';

/** Aprobar (desactiva la cuenta) o rechazar con una respuesta las solicitudes de eliminación. */
export function useEliminaciones() {
  const s = useSuperadmin();
  const accion = useAccion();
  const modal = useAccion();
  const [ocupadoId, setOcupadoId] = useState<number | null>(null);
  const [rechazando, setRechazando] = useState<SolicitudEliminacion | null>(null);

  const aprobar = async (e: SolicitudEliminacion) => {
    const seguro = await confirmar({ titulo: T.confirmarTitulo, mensaje: T.confirmarTexto(e.nombre), textoSi: T.si, textoNo: T.no });
    if (!seguro) return;
    setOcupadoId(e.id);
    const ok = await accion.ejecutar(() => resolverSolicitudEliminacion(e.id, true), T.error);
    if (ok) await s.recargar();
    setOcupadoId(null);
  };

  const confirmarRechazo = async (respuesta: string) => {
    if (!rechazando) return;
    const ok = await modal.ejecutar(() => resolverSolicitudEliminacion(rechazando.id, false, respuesta), T.error);
    if (ok) {
      setRechazando(null);
      await s.recargar();
    }
  };

  return {
    solicitudes: s.datos?.eliminaciones ?? [],
    aprobar,
    pedirRechazo: (e: SolicitudEliminacion) => {
      modal.limpiarError();
      setRechazando(e);
    },
    confirmarRechazo,
    cerrarRechazo: () => setRechazando(null),
    rechazando,
    rechazandoOcupado: modal.ocupado,
    errorRechazo: modal.error,
    ocupadoId,
    error: accion.error,
    superadmin: s,
  };
}
