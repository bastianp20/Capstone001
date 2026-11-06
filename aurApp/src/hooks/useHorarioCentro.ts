import { useState } from 'react';

import { guardarHorarioCentro } from '@/Api/postInfo';
import { TEXTOS_HORARIO_CENTRO as T } from '@/constants/constants';
import { useCentro } from '@/context/CentroContext';
import type { DiaHorarioCentroForm } from '@/interfaces';
import { diasDesdeHorarios, horariosDesdeDias, validarDiasCentro } from '@/lib/horarioCentro';

import { useAccion } from './useAccion';

/** Mi centro → "Horario del centro". Si el centro es 24/7, el horario es completo y no se edita. */
export function useHorarioCentro() {
  const c = useCentro();
  const detalle = c.datos?.detalle ?? null;
  // null = sin cambios (se muestra lo guardado)
  const [editados, setEditados] = useState<DiaHorarioCentroForm[] | null>(null);
  const [guardado, setGuardado] = useState(false);
  const { ejecutar, ocupado, error, setError } = useAccion();

  const dias = editados ?? (detalle ? diasDesdeHorarios(detalle.horarios) : []);

  const cambiarDia = (i: number, cambio: Partial<DiaHorarioCentroForm>) => {
    setEditados(dias.map((d, j) => (j === i ? { ...d, ...cambio } : d)));
    setGuardado(false);
  };

  const guardar = async () => {
    if (!detalle) return;
    const problema = validarDiasCentro(dias);
    if (problema) return setError(problema);
    if (await ejecutar(() => guardarHorarioCentro(detalle.id, horariosDesdeDias(dias)), T.errorGuardar)) {
      setEditados(null);
      setGuardado(true);
      c.recargar();
    }
  };

  return {
    cargando: c.cargando && !detalle,
    errorCarga: c.error,
    es247: detalle?.urgencias247 ?? false,
    dias, cambiarDia,
    guardar, guardando: ocupado, error, guardado,
  };
}
