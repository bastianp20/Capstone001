import { useState } from 'react';

import { guardarUrgenciasCentro } from '@/Api/postInfo';
import type { CentroDetalle } from '@/interfaces';

import { useAccion } from './useAccion';

/** "Urgencias y UCI" del centro: dos interruptores que se guardan juntos. */
export function useUrgenciasCentro(centro: CentroDetalle, onGuardado: () => void) {
  // null = lo que viene del centro (sin cambios)
  const [tieneUci, setTieneUci] = useState<boolean | null>(null);
  const [urgencias247, setUrgencias247] = useState<boolean | null>(null);
  const [guardado, setGuardado] = useState(false);
  const { ejecutar, ocupado, error } = useAccion();

  const uci = tieneUci ?? centro.tieneUci;
  const u247 = urgencias247 ?? centro.urgencias247;
  const hayCambios = uci !== centro.tieneUci || u247 !== centro.urgencias247 || !centro.urgenciasRevisadas;

  const cambiar = (fn: (v: boolean) => void) => (v: boolean) => {
    fn(v);
    setGuardado(false);
  };

  const guardar = async () => {
    if (await ejecutar(() => guardarUrgenciasCentro(centro.id, uci, u247), 'No se pudo guardar.')) {
      setTieneUci(null);
      setUrgencias247(null);
      setGuardado(true);
      onGuardado();
    }
  };

  return {
    tieneUci: uci, setTieneUci: cambiar(setTieneUci),
    urgencias247: u247, setUrgencias247: cambiar(setUrgencias247),
    hayCambios, guardar, ocupado, error, guardado,
  };
}
