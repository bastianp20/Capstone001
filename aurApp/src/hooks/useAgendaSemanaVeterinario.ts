import { router } from 'expo-router';
import { useState } from 'react';

import { quitarBloqueo } from '@/Api/postInfo';
import { TEXTOS_MI_AGENDA as T } from '@/constants/constants';
import type { CeldaAgenda } from '@/interfaces';
import { celdasDelDia, citaModificable, diasParaChips } from '@/lib/agendaSemana';
import { confirmar } from '@/lib/confirmar';
import { desdeMinutos, aMinutos, diaSemanaIso, formatFechaHoraCita, hoy, partesFechaCita, sumarDias } from '@/lib/fechas';

import { useAccion } from './useAccion';
import { useDatosAgendaVeterinario } from './useDatosAgendaVeterinario';

const lunesDe = (fecha: string) => sumarDias(fecha, -(diaSemanaIso(fecha) - 1));

/** Agenda "Semana": se elige un día de la semana y se ven todas sus horas. */
export function useAgendaSemanaVeterinario() {
  const base = useDatosAgendaVeterinario();
  const [fecha, setFecha] = useState(hoy());
  const accion = useAccion();

  const lunes = lunesDe(fecha);
  const dias = diasParaChips(lunes, 7, base.datos.citas);
  const celdas = celdasDelDia(fecha, base.datos);

  const elegirCelda = async (celda: CeldaAgenda) => {
    if (celda.tipo === 'libre') {
      const hasta = desdeMinutos(Math.min(aMinutos(celda.hora) + base.datos.duracion, 23 * 60 + 59));
      router.push({ pathname: '/veterinario/bloquear', params: { fecha: celda.fecha, desde: celda.hora, hasta } });
    } else if (celda.tipo === 'tomada' && celda.cita) {
      if (citaModificable(celda.cita)) router.push({ pathname: '/veterinario/cita/[id]', params: { id: celda.cita.id } });
      else router.push({ pathname: '/veterinario/paciente/[id]', params: { id: celda.cita.mascotaId } });
    } else if (celda.tipo === 'bloqueada' && celda.bloqueo) {
      const b = celda.bloqueo;
      const detalle = `${formatFechaHoraCita(b.desde)} a ${partesFechaCita(b.hasta).hora} · ${b.motivo}`;
      const seguro = await confirmar({ titulo: T.quitarBloqueoTitulo, mensaje: T.quitarBloqueo(detalle), textoSi: T.si, textoNo: T.no });
      if (seguro && (await accion.ejecutar(() => quitarBloqueo(b.id), T.quitarBloqueoTitulo))) base.recargar();
    }
  };

  return {
    ...base,
    fecha,
    elegirFecha: setFecha,
    dias,
    celdas,
    semanaAnterior: () => setFecha(sumarDias(lunes, -7)),
    semanaSiguiente: () => setFecha(sumarDias(lunes, 7)),
    irAHoy: () => setFecha(hoy()),
    elegirCelda,
    errorAccion: accion.error,
  };
}
