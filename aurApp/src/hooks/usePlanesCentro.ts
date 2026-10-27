import { useState } from 'react';

import { solicitarCambioPlan } from '@/Api/postInfo';
import { TEXTOS_PLANES as T } from '@/constants/constants';
import { useCentro } from '@/context/CentroContext';
import type { Plan } from '@/interfaces';

import { useAccion } from './useAccion';

/** Ver los planes y pedir un cambio (lo activa el superadmin). */
export function usePlanesCentro() {
  const { datos, centroId, recargar, cargando } = useCentro();
  const [eligiendo, setEligiendo] = useState<Plan | null>(null);
  const [aviso, setAviso] = useState('');
  const { ejecutar, ocupado, error, limpiarError } = useAccion();
  const suscripcion = datos?.suscripcion ?? null;

  const confirmar = async (mensaje: string) => {
    if (!eligiendo || !centroId) return;
    const ok = await ejecutar(() => solicitarCambioPlan(centroId, eligiendo.id, mensaje), T.error);
    if (ok) {
      setEligiendo(null);
      setAviso(T.enviada);
      await recargar();
    }
  };

  return {
    planes: datos?.planes ?? [],
    suscripcion,
    hayPendiente: Boolean(suscripcion?.planSolicitado),
    eligiendo,
    elegir: (p: Plan) => {
      limpiarError();
      setEligiendo(p);
    },
    cerrar: () => setEligiendo(null),
    confirmar,
    enviando: ocupado,
    error,
    aviso,
    cargando,
  };
}
