import { useMemo, useState } from 'react';

import { getMisPublicaciones } from '@/Api/getInfo';
import { FILTROS_PUBLICACIONES, OPCIONES_FILTRO_PUBLICACIONES } from '@/constants/constants';
import type { FiltroPublicaciones } from '@/interfaces';

import { useAccionesPublicacion } from './useAccionesPublicacion';
import { useCargaDatos } from './useCargaDatos';
import { useRecargarAlVolver } from './useRecargarAlVolver';

/** Mis publicaciones (versión liviana de la web): por estado, con retirar / volver a publicar. */
export function useMisPublicaciones() {
  const carga = useCargaDatos(getMisPublicaciones, []);
  useRecargarAlVolver(carga.recargar);
  const [filtro, setFiltro] = useState<FiltroPublicaciones>('activos');
  const acciones = useAccionesPublicacion(carga.recargar);

  const lista = useMemo(() => carga.datos ?? [], [carga.datos]);
  const visibles = useMemo(() => lista.filter((p) => FILTROS_PUBLICACIONES[filtro](p.estado)), [lista, filtro]);
  const opciones = OPCIONES_FILTRO_PUBLICACIONES.map((o) => ({ ...o, cantidad: lista.filter((p) => FILTROS_PUBLICACIONES[o.valor](p.estado)).length }));

  return {
    cargando: carga.cargando,
    errorCarga: carga.error,
    recargar: carga.recargar,
    recargando: carga.recargando,
    hayPublicaciones: lista.length > 0,
    opciones,
    filtro,
    setFiltro,
    visibles,
    ...acciones,
  };
}
