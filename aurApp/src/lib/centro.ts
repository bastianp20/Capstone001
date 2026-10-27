import { TEXTOS_CENTRO } from '@/constants/constants';
import type { CentroDetalle, CitaCentro, FiltroAgendaCentro, SuscripcionCentro } from '@/interfaces';

import { horarioDelDia } from './agenda';
import { diaDeCita, diaSemanaIso, hoy, sumarDias, tiempoHasta } from './fechas';

// Reglas de la vista del administrador de centro.

const esActiva = (c: CitaCentro) => c.estado !== 'cancelada' && c.estado !== 'completada';
const esDeHoy = (c: CitaCentro) => diaDeCita(c.fechaHora) === hoy();
const esDeHoyEnAdelante = (c: CitaCentro) => diaDeCita(c.fechaHora) >= hoy();

export const FILTROS_CITA_CENTRO: Record<FiltroAgendaCentro, (c: CitaCentro) => boolean> = {
  hoy: (c) => esDeHoy(c) && c.estado !== 'cancelada',
  proximas: (c) => esDeHoyEnAdelante(c) && esActiva(c),
  sinAsignar: (c) => c.veterinario === null && esActiva(c) && esDeHoyEnAdelante(c),
  pasadas: (c) => !esDeHoyEnAdelante(c),
};

export const camposBusquedaCitaCentro = (c: CitaCentro) => [c.mascota, c.dueno, c.veterinario, c.motivo];

/** Citas (sin canceladas) de cada día de esta semana, de lunes a domingo, e índice de hoy. */
export const citasDeLaSemana = (citas: CitaCentro[]) => {
  const indiceHoy = diaSemanaIso(hoy()) - 1;
  const lunes = sumarDias(hoy(), -indiceHoy);
  const porDia = Array.from({ length: 7 }, (_, i) => {
    const dia = sumarDias(lunes, i);
    return citas.filter((c) => c.estado !== 'cancelada' && diaDeCita(c.fechaHora) === dia).length;
  });
  return { porDia, indiceHoy };
};

/** Las próximas citas activas (desde ahora), la más cercana primero. */
export const proximasCitas = (citas: CitaCentro[], cantidad: number) => {
  const ahora = Date.now();
  return citas
    .filter((c) => esActiva(c) && new Date(c.fechaHora).getTime() >= ahora)
    .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))
    .slice(0, cantidad);
};

/** "09:00 a 18:00 · colación 13:00 a 14:00", o el aviso de cerrado / sin horarios. */
export const textoHorarioHoy = (detalle: CentroDetalle): string => {
  if (detalle.horarios.length === 0) return TEXTOS_CENTRO.sinHorarios;
  const h = horarioDelDia(hoy(), detalle.horarios);
  if (!h) return TEXTOS_CENTRO.cerradoHoy;
  return TEXTOS_CENTRO.textoHorario(h.abre, h.cierra, h.inicioColacion ? `${h.inicioColacion} a ${h.finColacion}` : null);
};

/** Fecha que importa de la suscripción (fin de la prueba o renovación) y el texto para mostrarla. */
export const vencimientoSuscripcion = (s: SuscripcionCentro): { texto: string; progreso: number } => {
  const fin = s.estado === 'prueba' ? s.finPrueba : s.renovacion;
  if (!fin || s.estado === 'vencida' || s.estado === 'cancelada') return { texto: TEXTOS_CENTRO.vencida, progreso: 1 };
  const total = Math.max(1, (new Date(fin).getTime() - new Date(s.inicio).getTime()) / 86_400_000);
  const pasados = (Date.now() - new Date(s.inicio).getTime()) / 86_400_000;
  const texto = s.estado === 'prueba' ? TEXTOS_CENTRO.pruebaTermina(tiempoHasta(fin)) : TEXTOS_CENTRO.renueva(tiempoHasta(fin));
  return { texto, progreso: Math.max(0, Math.min(1, pasados / total)) };
};
