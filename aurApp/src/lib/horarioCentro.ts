// Horario de un centro: formulario ↔ base y la revisión antes de guardar (igual que la web).
import { DIAS_SEMANA_LARGOS, TEXTOS_HORARIO_CENTRO as T } from '@/constants/constants';
import type { DiaHorarioCentroForm, HorarioCentro } from '@/interfaces';

import { normalizarHora } from './horarioAtencion';

const BASE: DiaHorarioCentroForm[] = DIAS_SEMANA_LARGOS.slice(1).map((nombre, i) => ({
  dia: i + 1,
  nombre,
  atiende: i < 6,
  abre: i === 5 ? '10:00' : '09:00',
  cierra: i === 5 ? '14:00' : '19:00',
  conColacion: i < 5,
  inicioColacion: '14:00',
  finColacion: '15:00',
}));

/** Un día de 00:00 a 24:00 (centro 24/7) se lee "Las 24 horas". */
export const esDiaCompleto = (h: { abre: string; cierra: string }) => h.abre === '00:00' && h.cierra.startsWith('24:00');

export const textoHorarioCentro = (h: HorarioCentro) =>
  esDiaCompleto(h)
    ? T.diaCompleto
    : `${h.abre} a ${h.cierra}${h.inicioColacion ? ` · colación ${h.inicioColacion} a ${h.finColacion}` : ''}`;

export const diasDesdeHorarios = (horarios: HorarioCentro[]): DiaHorarioCentroForm[] =>
  horarios.length === 0
    ? BASE
    : BASE.map((b) => {
        const h = horarios.find((x) => x.diaSemana === b.dia);
        if (!h) return { ...b, atiende: false };
        return {
          ...b,
          atiende: true,
          abre: h.abre,
          cierra: h.cierra.startsWith('24:00') ? '23:59' : h.cierra,
          conColacion: h.inicioColacion !== null,
          inicioColacion: h.inicioColacion ?? b.inicioColacion,
          finColacion: h.finColacion ?? b.finColacion,
        };
      });

export const validarDiasCentro = (dias: DiaHorarioCentroForm[]): string | null => {
  const abiertos = dias.filter((d) => d.atiende);
  if (abiertos.length === 0) return T.sinDias;
  for (const d of abiertos) {
    const horas = [d.abre, d.cierra, ...(d.conColacion ? [d.inicioColacion, d.finColacion] : [])];
    if (horas.some((h) => !normalizarHora(h))) return T.errorCierre(d.nombre);
    if (d.cierra <= d.abre) return T.errorCierre(d.nombre);
    if (d.conColacion && !(d.abre < d.inicioColacion && d.inicioColacion < d.finColacion && d.finColacion < d.cierra)) {
      return T.errorColacion(d.nombre);
    }
  }
  return null;
};

export const horariosDesdeDias = (dias: DiaHorarioCentroForm[]) =>
  dias
    .filter((d) => d.atiende)
    .map((d) => ({
      dia_semana: d.dia,
      abre: d.abre,
      cierra: d.cierra,
      inicio_colacion: d.conColacion ? d.inicioColacion : null,
      fin_colacion: d.conColacion ? d.finColacion : null,
    }));
