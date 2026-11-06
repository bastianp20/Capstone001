// Cálculos del horario de atención del veterinario (pantalla "Mi horario").
// Solo transforman datos; el estado vive en hooks/useHorarioAtencion.ts.
import { CLAVE_INDEPENDIENTE, DIAS_SEMANA, HORARIO_POR_DEFECTO, PASOS_PERFIL_VETERINARIO, TEXTOS_HORARIO_ATENCION as T } from "../constants";
import type { DiaHorarioForm, HorarioAtencion, HorarioPorLugar, LugarAtencion, PasoPerfilVeterinario, ProgresoPerfilVeterinario, TramoHorario } from "../interfaces";

export const claveLugar = (centroId: number | null) => (centroId === null ? CLAVE_INDEPENDIENTE : String(centroId));

const diaVacio = (): DiaHorarioForm => ({ activo: false, ...HORARIO_POR_DEFECTO });

// Los 7 días de un lugar a partir de lo guardado (si un día tiene varios tramos, toma el primero).
const diasDelLugar = (tramos: TramoHorario[], centroId: number | null): DiaHorarioForm[] =>
  Array.from({ length: 7 }, (_, i) => {
    const t = tramos.find((x) => x.centroId === centroId && x.diaSemana === i + 1);
    return t ? { activo: true, desde: t.desde, hasta: t.hasta } : diaVacio();
  });

export const formDesdeHorario = (h: HorarioAtencion): HorarioPorLugar =>
  Object.fromEntries(h.lugares.map((l) => [claveLugar(l.centroId), diasDelLugar(h.tramos, l.centroId)]));

// Copia el horario del centro: los días que abre quedan marcados con su horario.
export const diasDesdeCentro = (lugar: LugarAtencion): DiaHorarioForm[] =>
  Array.from({ length: 7 }, (_, i) => {
    const h = lugar.horarioCentro.find((x) => x.diaSemana === i + 1);
    // El campo de hora no admite 24:00 (centro 24/7): se usa 23:59
    return h ? { activo: true, desde: h.abre, hasta: h.cierra.startsWith("24:00") ? "23:59" : h.cierra } : diaVacio();
  });

export const tramosDesdeForm = (lugares: LugarAtencion[], form: HorarioPorLugar): TramoHorario[] =>
  lugares.flatMap((l) =>
    (form[claveLugar(l.centroId)] ?? [])
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => d.activo)
      .map(({ d, i }) => ({ centroId: l.centroId, diaSemana: i + 1, desde: d.desde, hasta: d.hasta })),
  );

// Revisa antes de enviar: término después del inicio y sin cruces entre lugares el mismo día.
export const validarTramos = (tramos: TramoHorario[]): string | null => {
  if (tramos.length === 0) return T.sinDias;
  for (const t of tramos) {
    if (!t.desde || !t.hasta || t.hasta <= t.desde) return T.errorHasta(DIAS_SEMANA[t.diaSemana]);
  }
  for (let dia = 1; dia <= 7; dia++) {
    const delDia = tramos.filter((t) => t.diaSemana === dia).sort((a, b) => a.desde.localeCompare(b.desde));
    for (let i = 1; i < delDia.length; i++) {
      if (delDia[i].desde < delDia[i - 1].hasta) return T.errorCruce(DIAS_SEMANA[dia]);
    }
  }
  return null;
};

// ---- Progreso del perfil ----
export const pasosDelPerfil = (p: ProgresoPerfilVeterinario): PasoPerfilVeterinario[] =>
  PASOS_PERFIL_VETERINARIO.filter((paso) => p.pasos[paso] !== undefined && p.pasos[paso] !== null);

export const pasosPendientes = (p: ProgresoPerfilVeterinario): PasoPerfilVeterinario[] =>
  pasosDelPerfil(p).filter((paso) => !p.pasos[paso]);

export const porcentajePerfil = (p: ProgresoPerfilVeterinario): number => {
  const total = pasosDelPerfil(p).length;
  return total === 0 ? 100 : Math.round(((total - pasosPendientes(p).length) / total) * 100);
};
