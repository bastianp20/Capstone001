import { useMemo } from 'react';

import { FILTROS_APROBACIONES } from '@/constants/constants';
import { useSuperadmin } from '@/context/SuperadminContext';
import type { FiltroAprobaciones, SolicitudPendiente } from '@/interfaces';
import { camposBusquedaSolicitud, FILTROS_SOLICITUD } from '@/lib/superadmin';

import { useFiltro } from './useFiltro';
import { useResolverSolicitud } from './useResolverSolicitud';

export function useAprobaciones() {
  const s = useSuperadmin();
  const solicitudes = useMemo(() => s.datos?.solicitudes ?? [], [s.datos]);
  const f = useFiltro<SolicitudPendiente, FiltroAprobaciones>({
    items: solicitudes,
    camposBusqueda: camposBusquedaSolicitud,
    filtros: FILTROS_SOLICITUD,
    filtroInicial: 'todas',
  });
  return {
    ...f,
    opciones: FILTROS_APROBACIONES.map((o) => ({ ...o, cantidad: f.cantidad(o.valor) })),
    hay: solicitudes.length > 0,
    resolver: useResolverSolicitud(),
    superadmin: s,
  };
}
