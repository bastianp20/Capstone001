import { useMemo } from 'react';

import { FILTROS_AGENDA_CENTRO } from '@/constants/constants';
import { useCentro } from '@/context/CentroContext';
import type { CitaCentro, FiltroAgendaCentro } from '@/interfaces';
import { camposBusquedaCitaCentro, FILTROS_CITA_CENTRO } from '@/lib/centro';
import { agruparPorDia } from '@/lib/veterinario';

import { useFiltro } from './useFiltro';

export function useAgendaCentro() {
  const centro = useCentro();
  // La base las entrega de la más nueva a la más antigua; para hoy y lo que viene, mejor en orden de hora.
  const citas = useMemo(() => [...(centro.datos?.citas ?? [])].reverse(), [centro.datos]);

  const f = useFiltro<CitaCentro, FiltroAgendaCentro>({
    items: citas,
    camposBusqueda: camposBusquedaCitaCentro,
    filtros: FILTROS_CITA_CENTRO,
    filtroInicial: 'hoy',
  });

  const grupos = useMemo(() => agruparPorDia(f.filtro === 'pasadas' ? [...f.visibles].reverse() : f.visibles), [f.visibles, f.filtro]);

  return {
    ...f,
    grupos,
    opciones: FILTROS_AGENDA_CENTRO.map((o) => ({ ...o, cantidad: f.cantidad(o.valor) })),
    hayEnFiltro: f.cantidad(f.filtro) > 0,
    centro,
  };
}
