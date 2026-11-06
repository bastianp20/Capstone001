import { useEffect, useState } from 'react';

import { estadoUciDesdeFila, getUrgencias } from '@/Api/getInfo';
import type { EstadoUciCentro, FiltrosUrgencias } from '@/interfaces';
import { comunasDe, filtrarCentros, prepararCentros } from '@/lib/urgencias';
import { supabase } from '@/lib/supabase';

import { useConsulta } from './useConsulta';

const SIN_FILTROS: FiltrosUrgencias = { comuna: null, soloAbiertos: false, soloUciDisponible: false };

/** Urgencias sin cuenta: centros y veterinarios 24/7, con la UCI EN VIVO (Supabase Realtime) y filtros. */
export function useUrgencias() {
  const { datos, cargando, error, recargar } = useConsulta(getUrgencias, []);
  // Cambios de UCI que llegan por Realtime después de cargar (centro → estado)
  const [enVivo, setEnVivo] = useState<Record<number, EstadoUciCentro | null>>({});
  const [ahora, setAhora] = useState(() => new Date());
  const [filtros, setFiltros] = useState<FiltrosUrgencias>(SIN_FILTROS);

  useEffect(() => {
    const canal = supabase
      .channel('urgencias-uci')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'estado_uci_centros' }, (cambio) => {
        if (cambio.eventType === 'DELETE') {
          const id = (cambio.old as { centro_id?: number }).centro_id;
          if (id !== undefined) setEnVivo((e) => ({ ...e, [id]: null }));
        } else {
          const estado = estadoUciDesdeFila(cambio.new as Parameters<typeof estadoUciDesdeFila>[0]);
          setEnVivo((e) => ({ ...e, [estado.centroId]: estado }));
        }
      })
      .subscribe();
    // "Abierto ahora" y "actualizado hace X" se recalculan cada minuto
    const reloj = setInterval(() => setAhora(new Date()), 60_000);
    return () => {
      clearInterval(reloj);
      supabase.removeChannel(canal);
    };
  }, []);

  const centros = prepararCentros(
    (datos?.centros ?? []).map((c) => (c.id in enVivo ? { ...c, estadoUci: c.tieneUci ? enVivo[c.id] : null } : c)),
    ahora,
  );

  return {
    centros: filtrarCentros(centros, filtros),
    veterinarios: (datos?.veterinarios ?? []).filter((v) => !filtros.comuna || v.comunas.includes(filtros.comuna)),
    comunas: comunasDe(datos?.centros ?? []),
    filtros,
    cambiarFiltros: (cambio: Partial<FiltrosUrgencias>) => setFiltros((f) => ({ ...f, ...cambio })),
    ahora,
    cargando,
    error,
    recargar: () => {
      setAhora(new Date());
      recargar();
    },
  };
}
