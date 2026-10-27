import { useState } from 'react';

import { resolverSolicitudPlan } from '@/Api/postInfo';
import { TEXTOS_SOLICITUDES_PLAN as T } from '@/constants/constants';
import { useSuperadmin } from '@/context/SuperadminContext';
import type { SolicitudPlan } from '@/interfaces';
import { confirmar } from '@/lib/confirmar';

import { useAccion } from './useAccion';

/** Activar o rechazar los cambios de plan que pidieron los centros. */
export function useSolicitudesPlan() {
  const s = useSuperadmin();
  const { ejecutar, error } = useAccion();
  const [ocupadoId, setOcupadoId] = useState<number | null>(null);

  const resolver = async (sol: SolicitudPlan, aprobar: boolean) => {
    const seguro = await confirmar({
      titulo: aprobar ? T.confirmarActivarTitulo : T.confirmarRechazarTitulo,
      mensaje: aprobar ? T.confirmarActivarTexto(sol.centro, sol.planSolicitado) : T.confirmarRechazarTexto(sol.centro),
      textoSi: T.si,
      textoNo: T.no,
    });
    if (!seguro) return;
    setOcupadoId(sol.solicitudId);
    const ok = await ejecutar(() => resolverSolicitudPlan(sol.solicitudId, aprobar), T.error);
    if (ok) await s.recargar();
    setOcupadoId(null);
  };

  return {
    solicitudes: s.datos?.solicitudesPlan ?? [],
    activar: (sol: SolicitudPlan) => resolver(sol, true),
    rechazar: (sol: SolicitudPlan) => resolver(sol, false),
    ocupadoId,
    error,
    superadmin: s,
  };
}
