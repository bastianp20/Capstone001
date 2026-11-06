import { MAX_URGENTES_SOLIDARIA } from '@/constants/constants';
import type { AnimalParaVeterinario, PestanaSolidaria } from '@/interfaces';

// Cálculos de Adopción solidaria (sin estado).

/** Pidió revisión y nadie la ha hecho todavía. */
export const esperaAtencion = (a: AnimalParaVeterinario) => a.solicitaAtencion && !a.revisada;

/** Los que más necesitan atención: primero los de su comuna, después los que llevan más días esperando. */
export const masUrgentes = (animales: AnimalParaVeterinario[]): AnimalParaVeterinario[] =>
  animales
    .filter(esperaAtencion)
    .sort((a, b) => Number(b.enMiComuna) - Number(a.enMiComuna) || b.diasEsperando - a.diasEsperando)
    .slice(0, MAX_URGENTES_SOLIDARIA);

export const FILTROS_PESTANA_SOLIDARIA: Record<Exclude<PestanaSolidaria, 'mias'>, (a: AnimalParaVeterinario) => boolean> = {
  esperando: esperaAtencion,
  todos: () => true,
};
