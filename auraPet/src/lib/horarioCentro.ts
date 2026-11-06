// Horario de un centro: del formato de la base al del formulario y de vuelta,
// y la revisión antes de guardar. Lo usan "Crear centro" y "Mi centro".
import { DIAS_INICIALES_CENTRO, TEXTOS_HORARIO_CENTRO as T } from "../constants";
import type { DiaFormulario, HorarioCentro, HorarioCentroNuevo } from "../interfaces";

// Los 7 días del formulario a partir del horario guardado.
// Sin horario guardado, parte de los valores por defecto (lunes a sábado).
export const diasDesdeHorarios = (horarios: HorarioCentro[]): DiaFormulario[] =>
  horarios.length === 0
    ? DIAS_INICIALES_CENTRO
    : DIAS_INICIALES_CENTRO.map((base) => {
        const h = horarios.find((x) => x.diaSemana === base.dia);
        if (!h) return { ...base, atiende: false };
        return {
          ...base,
          atiende: true,
          abre: h.abre,
          // El campo de hora no admite 24:00 (horario de un centro que fue 24/7)
          cierra: h.cierra.startsWith("24:00") ? "23:59" : h.cierra,
          conColacion: h.inicioColacion !== null,
          inicioColacion: h.inicioColacion ?? base.inicioColacion,
          finColacion: h.finColacion ?? base.finColacion,
        };
      });

// null si está todo bien; si no, el primer problema (la base igual lo vuelve a revisar)
export const validarDiasCentro = (dias: DiaFormulario[]): string | null => {
  const abiertos = dias.filter((d) => d.atiende);
  if (abiertos.length === 0) return T.sinDias;
  for (const d of abiertos) {
    if (!d.abre || !d.cierra || d.cierra <= d.abre) return T.errorCierre(d.nombre);
    if (d.conColacion && !(d.abre < d.inicioColacion && d.inicioColacion < d.finColacion && d.finColacion < d.cierra)) {
      return T.errorColacion(d.nombre);
    }
  }
  return null;
};

export const horariosDesdeDias = (dias: DiaFormulario[]): HorarioCentroNuevo[] =>
  dias
    .filter((d) => d.atiende)
    .map((d) => ({
      dia_semana: d.dia,
      abre: d.abre,
      cierra: d.cierra,
      inicio_colacion: d.conColacion ? d.inicioColacion : null,
      fin_colacion: d.conColacion ? d.finColacion : null,
    }));
