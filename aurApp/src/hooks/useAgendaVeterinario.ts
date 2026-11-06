import { useMemo } from 'react';

import { FILTROS_AGENDA_VETERINARIO } from '@/constants/constants';
import { useVeterinario } from '@/context/VeterinarioContext';
import type { CitaVeterinario, FiltroAgendaVeterinario } from '@/interfaces';
import { agruparPorDia, camposBusquedaCitaVeterinario, FILTROS_AGENDA } from '@/lib/veterinario';

import { useAccionesCitaVeterinario } from './useAccionesCitaVeterinario';
import { useFiltro } from './useFiltro';

export function useAgendaVeterinario() {
  const { datos, cargando, error, recargar, recargando } = useVeterinario();
  const citas = useMemo(() => datos?.citas ?? [], [datos]);
  const acciones = useAccionesCitaVeterinario();

  const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro<CitaVeterinario, FiltroAgendaVeterinario>({
    items: citas,
    camposBusqueda: camposBusquedaCitaVeterinario,
    filtros: FILTROS_AGENDA,
    filtroInicial: 'hoy',
  });

  // Las pasadas, de la más reciente a la más antigua; el resto, en orden de llegada.
  const grupos = useMemo(
    () => agruparPorDia(filtro === 'pasadas' ? [...visibles].reverse() : visibles),
    [visibles, filtro],
  );

  return {
    busqueda,
    setBusqueda,
    filtro,
    setFiltro,
    opciones: FILTROS_AGENDA_VETERINARIO.map((o) => ({ ...o, cantidad: cantidad(o.valor) })),
    grupos,
    hayEnFiltro: cantidad(filtro) > 0,
    acciones,
    cargando,
    error,
    recargar,
    recargando,
  };
}
