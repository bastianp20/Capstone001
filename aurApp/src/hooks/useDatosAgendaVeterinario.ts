import { useState } from 'react';

import { getMiHorarioAtencion, getMisBloqueos } from '@/Api/getInfo';
import { useVeterinario } from '@/context/VeterinarioContext';
import type { DatosSemanaAgenda } from '@/interfaces';

import { useConsulta } from './useConsulta';
import { useRecargarAlVolver } from './useRecargarAlVolver';

const cargar = async () => {
  const [horario, bloqueos] = await Promise.all([getMiHorarioAtencion(), getMisBloqueos()]);
  return { tramos: horario.tramos, duracion: horario.duracion, bloqueos };
};

/**
 * Todo lo que necesita la agenda con TODAS las horas: citas (del contexto del
 * veterinario), su horario de atención y sus bloqueos. Lo usan la agenda,
 * "Modificar cita" y "Bloquear horario".
 */
export function useDatosAgendaVeterinario() {
  const vet = useVeterinario();
  const extra = useConsulta(cargar, []);
  // "ahora" se toma una vez por carga, no en cada render
  const [ahora, setAhora] = useState(() => new Date());

  const recargar = () => {
    setAhora(new Date());
    extra.recargar();
    vet.recargar();
  };
  useRecargarAlVolver(recargar);

  const datos: DatosSemanaAgenda = {
    tramos: extra.datos?.tramos ?? [],
    duracion: extra.datos?.duracion ?? 30,
    bloqueos: extra.datos?.bloqueos ?? [],
    citas: vet.datos?.citas ?? [],
    ahora,
  };

  return {
    datos,
    sinHorario: !!extra.datos && extra.datos.tramos.length === 0,
    cargando: vet.cargando || extra.cargando,
    error: vet.error ?? extra.error,
    recargar,
    recargando: vet.recargando,
  };
}
