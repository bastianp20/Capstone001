import { useEffect } from 'react';

import type { ProgresoAtencion } from '@/interfaces';

import { useBorrador } from './useBorrador';

/** Qué va hecho en la atención de una cita (registro, receta, derivación) y desde cuándo está abierta. */
export function useProgresoAtencion(citaId: number) {
  const b = useBorrador<ProgresoAtencion>(`atencion-${citaId}`, { inicio: '', registro: false, medicamentos: 0, derivada: false });
  const { cargado, valor, cambiar } = b;

  // La primera vez que se abre queda la hora de inicio (para "En consulta · 18 min")
  useEffect(() => {
    if (cargado && !valor.inicio) cambiar({ inicio: new Date().toISOString() });
  }, [cargado, valor.inicio, cambiar]);

  return { progreso: valor, marcar: cambiar, olvidar: b.limpiar, cargado };
}
