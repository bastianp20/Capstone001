import { DIAS_SEMANA_CITAS, TEXTOS_CITAS } from '@/constants/constants';
import type { CitaDueno, FiltroCitas, GrupoCitas } from '@/interfaces';

import { diaDeCita, hoy, sumarDias } from './fechas';

// Reglas para la pestaña Citas. Se definen fuera de los componentes para que
// useFiltro reciba siempre las mismas funciones (así no recalcula en cada render).

const inicioDeHoy = (): number => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const esActiva = (c: CitaDueno) => c.estado !== 'cancelada' && c.estado !== 'completada';
const esDeHoyEnAdelante = (c: CitaDueno) => new Date(c.fechaHora).getTime() >= inicioDeHoy();

export const FILTROS_CITA: Record<FiltroCitas, (c: CitaDueno) => boolean> = {
  proximas: (c) => esActiva(c) && esDeHoyEnAdelante(c),
  pasadas: (c) => c.estado === 'completada' || (esActiva(c) && !esDeHoyEnAdelante(c)),
  canceladas: (c) => c.estado === 'cancelada',
};

export const camposBusquedaCita = (c: CitaDueno) => [c.motivo, c.mascota, c.veterinario, c.centro];

const porFechaAsc = (a: CitaDueno, b: CitaDueno) => a.fechaHora.localeCompare(b.fechaHora);
const porFechaDesc = (a: CitaDueno, b: CitaDueno) => b.fechaHora.localeCompare(a.fechaHora);

/** Próximas: "Esta semana" y "Más adelante". Pasadas y canceladas: una sola lista, la más nueva primero. */
export const agruparCitas = (citas: CitaDueno[], filtro: FiltroCitas): GrupoCitas[] => {
  if (filtro !== 'proximas') return [{ titulo: '', citas: [...citas].sort(porFechaDesc) }];

  const ultimoDiaSemana = sumarDias(hoy(), DIAS_SEMANA_CITAS - 1);
  const ordenadas = [...citas].sort(porFechaAsc);
  const grupos: GrupoCitas[] = [
    { titulo: TEXTOS_CITAS.estaSemana, citas: ordenadas.filter((c) => diaDeCita(c.fechaHora) <= ultimoDiaSemana) },
    { titulo: TEXTOS_CITAS.masAdelante, citas: ordenadas.filter((c) => diaDeCita(c.fechaHora) > ultimoDiaSemana) },
  ];
  return grupos.filter((g) => g.citas.length > 0);
};
