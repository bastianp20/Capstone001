import { DIAS_CORTOS, DIAS_PARA_AGENDAR, HORARIO_SIN_REGISTRO, MESES_CORTOS, PASO_HORA_CITA_MIN } from '@/constants/constants';
import type { DiaDisponible, HorarioCentro } from '@/interfaces';

import { aMinutos, desdeFechaDia, desdeMinutos, diaSemanaIso, hoy, sumarDias } from './fechas';

// Días y horas que se ofrecen al pedir hora. Son las mismas reglas que revisa
// solicitar_cita en la base (horario del centro y colación); la base es la que decide.

const MARGEN_MINUTOS_HOY = 30; // hoy no se ofrecen horas que empiecen en menos de media hora

/** Horario de ese día. Sin horarios registrados (o independiente) se usa un horario general. */
export const horarioDelDia = (fecha: string, horarios: HorarioCentro[] | null): HorarioCentro | null => {
  if (!horarios || horarios.length === 0) {
    return { diaSemana: diaSemanaIso(fecha), ...HORARIO_SIN_REGISTRO, inicioColacion: null, finColacion: null };
  }
  return horarios.find((h) => h.diaSemana === diaSemanaIso(fecha)) ?? null;
};

/** Próximos días en que se puede pedir hora (solo los que el centro atiende). */
export const diasDisponibles = (horarios: HorarioCentro[] | null): DiaDisponible[] =>
  Array.from({ length: DIAS_PARA_AGENDAR }, (_, i) => sumarDias(hoy(), i))
    .filter((fecha) => horarioDelDia(fecha, horarios) !== null)
    .map((fecha) => {
      const d = desdeFechaDia(fecha);
      return { fecha, diaSemana: DIAS_CORTOS[d.getDay()], numero: d.getDate().toString(), mes: MESES_CORTOS[d.getMonth()] };
    });

/** Horas de 15 en 15 minutos dentro del horario, sin la colación ni las que ya pasaron. */
export const horasDisponibles = (fecha: string, horarios: HorarioCentro[] | null): string[] => {
  const horario = horarioDelDia(fecha, horarios);
  if (!horario) return [];

  const ahora = new Date();
  const minimo = fecha === hoy() ? ahora.getHours() * 60 + ahora.getMinutes() + MARGEN_MINUTOS_HOY : 0;
  const colacion = horario.inicioColacion && horario.finColacion
    ? [aMinutos(horario.inicioColacion), aMinutos(horario.finColacion)]
    : null;

  const horas: string[] = [];
  for (let m = aMinutos(horario.abre); m < aMinutos(horario.cierra); m += PASO_HORA_CITA_MIN) {
    const enColacion = colacion && m >= colacion[0] && m < colacion[1];
    if (m >= minimo && !enColacion) horas.push(desdeMinutos(m));
  }
  return horas;
};
