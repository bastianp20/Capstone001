// La agenda del veterinario con TODAS sus horas: según su horario de atención,
// cada hora queda libre, tomada, bloqueada o pasada. Igual que la web
// (lib/agendaSemana.ts), pero se muestra día por día.
import { DIAS_CORTOS, DIAS_HORAS_LIBRES } from '@/constants/constants';
import type { CeldaAgenda, CitaVeterinario, DatosSemanaAgenda, DiaAgendaChip, HoraLibre, TramoHorario } from '@/interfaces';

import { aFechaHoraIso, aMinutos, desdeFechaDia, desdeMinutos, diaDeCita, diaSemanaIso, hoy, partesFechaCita, sumarDias } from './fechas';

const MS_MINUTO = 60_000;
const ms = (iso: string) => new Date(iso).getTime();

const horasDelDia = (tramos: TramoHorario[], diaSemana: number, duracion: number): string[] =>
  tramos
    .filter((t) => t.diaSemana === diaSemana)
    .flatMap((t) => {
      const horas: string[] = [];
      const fin = t.hasta.startsWith('24:00') ? 24 * 60 : aMinutos(t.hasta);
      for (let m = aMinutos(t.desde); m + duracion <= fin; m += duracion) horas.push(desdeMinutos(m));
      return horas;
    });

const ocupa = (c: CitaVeterinario) => c.estado !== 'cancelada';

/** Las horas de un día: las del horario y, aparte, las citas que caen fuera de él. Ordenadas por hora. */
export const celdasDelDia = (fecha: string, d: DatosSemanaAgenda): CeldaAgenda[] => {
  const ahora = d.ahora.getTime();
  const citasDelDia = d.citas.filter((c) => ocupa(c) && diaDeCita(c.fechaHora) === fecha);
  const usadas = new Set<number>();

  const celda = (hora: string, inicioMs: number, finMs: number, cita: CitaVeterinario | null, fueraDeHorario: boolean): CeldaAgenda => {
    const bloqueo = d.bloqueos.find((b) => inicioMs >= ms(b.desde) && inicioMs < ms(b.hasta)) ?? null;
    const tipo = cita ? 'tomada' : bloqueo ? 'bloqueada' : finMs <= ahora ? 'pasada' : 'libre';
    return { fecha, hora, inicio: new Date(inicioMs).toISOString(), fin: new Date(finMs).toISOString(), tipo, cita, bloqueo, fueraDeHorario };
  };

  const delHorario = horasDelDia(d.tramos, diaSemanaIso(fecha), d.duracion).map((hora) => {
    const inicioMs = ms(aFechaHoraIso(fecha, hora));
    const finMs = inicioMs + d.duracion * MS_MINUTO;
    const cita = citasDelDia.find((c) => !usadas.has(c.id) && ms(c.fechaHora) >= inicioMs && ms(c.fechaHora) < finMs) ?? null;
    if (cita) usadas.add(cita.id);
    return celda(hora, inicioMs, finMs, cita, false);
  });

  const fuera = citasDelDia
    .filter((c) => !usadas.has(c.id))
    .map((c) => celda(partesFechaCita(c.fechaHora).hora, ms(c.fechaHora), ms(c.fechaHora) + d.duracion * MS_MINUTO, c, d.tramos.length > 0));

  return [...delHorario, ...fuera].sort((a, b) => a.inicio.localeCompare(b.inicio));
};

/** Los chips de días: desde hoy (o el lunes de la semana elegida) y cuántas citas tiene cada uno. */
export const diasParaChips = (desde: string, cantidad: number, citas: CitaVeterinario[]): DiaAgendaChip[] =>
  Array.from({ length: cantidad }, (_, i) => {
    const fecha = sumarDias(desde, i);
    const d = desdeFechaDia(fecha);
    return {
      fecha,
      diaCorto: DIAS_CORTOS[d.getDay()],
      numero: d.getDate().toString(),
      esHoy: fecha === hoy(),
      conCitas: citas.filter((c) => ocupa(c) && diaDeCita(c.fechaHora) === fecha).length,
    };
  });

/** Horas libres desde ahora (para reagendar). */
export const horasLibres = (d: DatosSemanaAgenda): HoraLibre[] =>
  Array.from({ length: DIAS_HORAS_LIBRES }, (_, i) => sumarDias(hoy(), i))
    .flatMap((fecha) => celdasDelDia(fecha, d))
    .filter((c) => c.tipo === 'libre' && !c.fueraDeHorario && ms(c.inicio) > d.ahora.getTime())
    .map((c) => ({ fecha: c.fecha, hora: c.hora, inicio: c.inicio }));

/** Citas pendientes o confirmadas dentro de un rango (para "Bloquear horario"). */
export const citasEnRango = (citas: CitaVeterinario[], desde: string, hasta: string) =>
  citas.filter((c) => (c.estado === 'pendiente' || c.estado === 'confirmada') && ms(c.fechaHora) >= ms(desde) && ms(c.fechaHora) < ms(hasta));

/** ¿Se puede reagendar o cancelar? Pendiente o confirmada y todavía no pasa. */
export const citaModificable = (c: CitaVeterinario, ahora = new Date()) =>
  (c.estado === 'pendiente' || c.estado === 'confirmada') && ms(c.fechaHora) > ahora.getTime();

export const agruparPorDia = (horas: HoraLibre[]): { fecha: string; horas: HoraLibre[] }[] => {
  const grupos = new Map<string, HoraLibre[]>();
  for (const h of horas) grupos.set(h.fecha, [...(grupos.get(h.fecha) ?? []), h]);
  return [...grupos].map(([fecha, hs]) => ({ fecha, horas: hs }));
};
