import { useState } from 'react';

import { actualizarMiCita, rechazarCita } from '@/Api/postInfo';
import { TEXTOS_VETERINARIO } from '@/constants/constants';
import { useVeterinario } from '@/context/VeterinarioContext';
import type { CitaVeterinario, EstadoCita } from '@/interfaces';

import { useAccion } from './useAccion';

/** Confirmar, rechazar (con motivo), iniciar y terminar citas. Lo usan "Hoy" y "Agenda". */
export function useAccionesCitaVeterinario() {
  const { recargar } = useVeterinario();
  const { ejecutar, error, setError } = useAccion();
  const rechazo = useAccion();
  const [ocupadoId, setOcupadoId] = useState<number | null>(null);
  const [rechazando, setRechazando] = useState<CitaVeterinario | null>(null);

  const cambiarEstado = async (cita: CitaVeterinario, estado: EstadoCita) => {
    setOcupadoId(cita.id);
    const ok = await ejecutar(() => actualizarMiCita(cita.id, estado), TEXTOS_VETERINARIO.errorAccion);
    if (ok) await recargar();
    setOcupadoId(null);
  };

  const pedirRechazo = (cita: CitaVeterinario) => {
    rechazo.limpiarError();
    setRechazando(cita);
  };

  const confirmarRechazo = async (motivo: string) => {
    if (!rechazando) return;
    const ok = await rechazo.ejecutar(() => rechazarCita(rechazando.id, motivo), TEXTOS_VETERINARIO.errorAccion);
    if (ok) {
      setRechazando(null);
      await recargar();
    }
  };

  return {
    confirmar: (c: CitaVeterinario) => cambiarEstado(c, 'confirmada'),
    iniciar: (c: CitaVeterinario) => cambiarEstado(c, 'en_curso'),
    terminar: (c: CitaVeterinario) => cambiarEstado(c, 'completada'),
    pedirRechazo,
    confirmarRechazo,
    cerrarRechazo: () => setRechazando(null),
    rechazando,
    rechazandoOcupado: rechazo.ocupado,
    errorRechazo: rechazo.error,
    ocupadoId,
    error,
    limpiarError: () => setError(''),
  };
}
