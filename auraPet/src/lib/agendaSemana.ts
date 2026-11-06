// La semana de "Mi Agenda": todas las horas del veterinario según su horario de
// atención, cada una libre, tomada, bloqueada o pasada. Solo cálculos.
import type { CeldaAgenda, CitaAgendaItem, DatosSemanaAgenda, HoraLibre, SemanaAgenda, TramoHorario } from "../interfaces";
import { diaSemanaDeFecha, fechaDentroDe, fechaEnChile, formatDiaConNombre, formatHora24, isoDesdeFechaHora } from "./fechas";

const MS_MINUTO = 60_000;
const ms = (iso: string) => new Date(iso).getTime();
const d2 = (n: number) => String(n).padStart(2, "0");

export const minutosDe = (hora: string) => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};

export const horaDesdeMinutos = (min: number) => `${d2(Math.floor(min / 60))}:${d2(min % 60)}`;

export const sumarDias = (fecha: string, dias: number) => fechaDentroDe(dias, new Date(`${fecha}T12:00:00`));

// Lunes de la semana de una fecha ("2026-11-06" -> "2026-11-02")
export const lunesDe = (fecha: string) => sumarDias(fecha, -(diaSemanaDeFecha(fecha) - 1));

// Las 7 fechas de la semana que empieza ese lunes
export const fechasDeSemana = (lunes: string) => Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));

// Las horas de inicio de un día según sus tramos ("09:00", "09:30", …)
const horasDelDia = (tramos: TramoHorario[], diaSemana: number, duracion: number): string[] =>
  tramos
    .filter((t) => t.diaSemana === diaSemana)
    .flatMap((t) => {
      const horas: string[] = [];
      for (let m = minutosDe(t.desde); m + duracion <= minutosDe(t.hasta); m += duracion) horas.push(horaDesdeMinutos(m));
      return horas;
    });

const citaOcupa = (c: CitaAgendaItem) => c.estado !== "cancelada";

// Celdas de un día: las del horario y, aparte, las citas que caen fuera de él.
const celdasDelDia = (fecha: string, d: DatosSemanaAgenda): CeldaAgenda[] => {
  const ahora = d.ahora.getTime();
  const citasDelDia = d.citas.filter((c) => citaOcupa(c) && fechaEnChile(c.fechaHora) === fecha);
  const usadas = new Set<number>();

  const celda = (hora: string, inicioMs: number, finMs: number, cita: CitaAgendaItem | null, fueraDeHorario: boolean): CeldaAgenda => {
    const bloqueo = d.bloqueos.find((b) => inicioMs >= ms(b.desde) && inicioMs < ms(b.hasta)) ?? null;
    const tipo = cita ? "tomada" : bloqueo ? "bloqueada" : finMs <= ahora ? "pasada" : "libre";
    return { fecha, hora, inicio: new Date(inicioMs).toISOString(), fin: new Date(finMs).toISOString(), tipo, cita, bloqueo, fueraDeHorario };
  };

  const delHorario = horasDelDia(d.tramos, diaSemanaDeFecha(fecha), d.duracion).map((hora) => {
    const inicioMs = ms(isoDesdeFechaHora(fecha, hora));
    const finMs = inicioMs + d.duracion * MS_MINUTO;
    const cita = citasDelDia.find((c) => !usadas.has(c.id) && ms(c.fechaHora) >= inicioMs && ms(c.fechaHora) < finMs) ?? null;
    if (cita) usadas.add(cita.id);
    return celda(hora, inicioMs, finMs, cita, false);
  });

  const fuera = citasDelDia
    .filter((c) => !usadas.has(c.id))
    // Sin horario configurado no hay "fuera de horario": son simplemente sus citas
    .map((c) => celda(formatHora24(c.fechaHora), ms(c.fechaHora), ms(c.fechaHora) + d.duracion * MS_MINUTO, c, d.tramos.length > 0));

  return [...delHorario, ...fuera];
};

export const claveCelda = (fecha: string, hora: string) => `${fecha}|${hora}`;

export const armarSemana = (lunes: string, d: DatosSemanaAgenda): SemanaAgenda => {
  const hoy = fechaEnChile(d.ahora.toISOString());
  const fechas = fechasDeSemana(lunes);
  const celdas: Record<string, CeldaAgenda> = {};
  for (const fecha of fechas) {
    for (const c of celdasDelDia(fecha, d)) {
      // Dos citas a la misma hora fuera de horario: la segunda se corre un minuto en la clave
      let clave = claveCelda(fecha, c.hora);
      while (celdas[clave]) clave += "'";
      celdas[clave] = c;
    }
  }
  const horas = [...new Set(Object.keys(celdas).map((k) => k.split("|")[1]))].sort();
  return {
    dias: fechas.map((fecha) => ({ fecha, titulo: formatDiaConNombre(fecha), esHoy: fecha === hoy })),
    horas,
    celdas,
  };
};

// Horas libres desde ahora, para reagendar (los próximos "dias" días).
export const horasLibres = (d: DatosSemanaAgenda, dias: number): HoraLibre[] => {
  const hoy = fechaEnChile(d.ahora.toISOString());
  return Array.from({ length: dias }, (_, i) => sumarDias(hoy, i))
    .flatMap((fecha) => celdasDelDia(fecha, d))
    .filter((c) => c.tipo === "libre" && !c.fueraDeHorario && ms(c.inicio) > d.ahora.getTime())
    .map((c) => ({ fecha: c.fecha, hora: c.hora, inicio: c.inicio }));
};

// Agrupa las horas libres por día para mostrarlas como chips
export const agruparPorDia = (horas: HoraLibre[]): { fecha: string; titulo: string; horas: HoraLibre[] }[] => {
  const grupos = new Map<string, HoraLibre[]>();
  for (const h of horas) grupos.set(h.fecha, [...(grupos.get(h.fecha) ?? []), h]);
  return [...grupos].map(([fecha, hs]) => ({ fecha, titulo: formatDiaConNombre(fecha), horas: hs }));
};
