// Horario de atención del veterinario: del formato de la base al formulario y
// de vuelta, y la revisión antes de guardar. Igual que la web (lib/horarioAtencion.ts).
import { CLAVE_INDEPENDIENTE, DIAS_SEMANA_LARGOS, HORARIO_POR_DEFECTO_VET, TEXTOS_HORARIO_ATENCION as T } from '@/constants/constants';
import type { DiaHorarioForm, HorarioAtencion, HorarioPorLugar, LugarAtencion, TramoHorario } from '@/interfaces';

export const claveLugar = (centroId: number | null) => (centroId === null ? CLAVE_INDEPENDIENTE : String(centroId));

const diaVacio = (): DiaHorarioForm => ({ activo: false, ...HORARIO_POR_DEFECTO_VET });

// "24:00" (centro 24/7) no se puede escribir en el campo: se usa 23:59
const sin24 = (hora: string) => (hora.startsWith('24:00') ? '23:59' : hora);

export const formDesdeHorario = (h: HorarioAtencion): HorarioPorLugar =>
  Object.fromEntries(
    h.lugares.map((l) => [
      claveLugar(l.centroId),
      Array.from({ length: 7 }, (_, i) => {
        const t = h.tramos.find((x) => x.centroId === l.centroId && x.diaSemana === i + 1);
        return t ? { activo: true, desde: t.desde, hasta: sin24(t.hasta) } : diaVacio();
      }),
    ]),
  );

export const diasDesdeCentro = (lugar: LugarAtencion): DiaHorarioForm[] =>
  Array.from({ length: 7 }, (_, i) => {
    const h = lugar.horarioCentro.find((x) => x.diaSemana === i + 1);
    return h ? { activo: true, desde: h.abre, hasta: sin24(h.cierra) } : diaVacio();
  });

export const tramosDesdeForm = (lugares: LugarAtencion[], form: HorarioPorLugar): TramoHorario[] =>
  lugares.flatMap((l) =>
    (form[claveLugar(l.centroId)] ?? [])
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => d.activo)
      .map(({ d, i }) => ({ centroId: l.centroId, diaSemana: i + 1, desde: d.desde, hasta: d.hasta })),
  );

/** "9:30" o "09:30" → "09:30"; null si no es una hora válida. */
export const normalizarHora = (texto: string): string | null => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(texto.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${m[2]}`;
};

export const validarTramos = (tramos: TramoHorario[]): string | null => {
  if (tramos.length === 0) return T.sinDias;
  for (const t of tramos) {
    if (!normalizarHora(t.desde) || !normalizarHora(t.hasta)) return T.horaInvalida;
    if (t.hasta <= t.desde) return T.errorHasta(DIAS_SEMANA_LARGOS[t.diaSemana]);
  }
  for (let dia = 1; dia <= 7; dia++) {
    const delDia = tramos.filter((t) => t.diaSemana === dia).sort((a, b) => a.desde.localeCompare(b.desde));
    for (let i = 1; i < delDia.length; i++) {
      if (delDia[i].desde < delDia[i - 1].hasta) return T.errorCruce(DIAS_SEMANA_LARGOS[dia]);
    }
  }
  return null;
};
