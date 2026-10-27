import { useMemo, useState } from 'react';

import { cancelarCita } from '@/Api/postInfo';
import { FILTROS_CITAS, TEXTOS_CITAS } from '@/constants/constants';
import { useDatosDueno } from '@/context/DatosDuenoContext';
import type { CitaDueno, FiltroCitas } from '@/interfaces';
import { agruparCitas, camposBusquedaCita, FILTROS_CITA } from '@/lib/citas';
import { confirmar } from '@/lib/confirmar';
import { formatFechaHoraCita } from '@/lib/fechas';

import { useAccion } from './useAccion';
import { useFiltro } from './useFiltro';

/** Pestaña Citas: buscador, filtros con contador, grupos y cancelar. */
export function useCitas() {
  const { citas, mascotas, cargando, error, recargar, recargando } = useDatosDueno();
  const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro<CitaDueno, FiltroCitas>({
    items: citas,
    camposBusqueda: camposBusquedaCita,
    filtros: FILTROS_CITA,
    filtroInicial: 'proximas',
  });
  const { ejecutar, error: errorAccion } = useAccion();
  const [cancelandoId, setCancelandoId] = useState<number | null>(null);

  const grupos = useMemo(() => agruparCitas(visibles, filtro), [visibles, filtro]);
  const opciones = FILTROS_CITAS.map((o) => ({ ...o, cantidad: cantidad(o.valor) }));
  const fotoDe = (mascotaId: number) => mascotas.find((m) => m.id === mascotaId)?.fotoUrl ?? null;

  const cancelar = async (cita: CitaDueno) => {
    const seguro = await confirmar({
      titulo: TEXTOS_CITAS.confirmarCancelarTitulo,
      mensaje: TEXTOS_CITAS.confirmarCancelarTexto(cita.motivo, formatFechaHoraCita(cita.fechaHora)),
      textoSi: TEXTOS_CITAS.confirmarCancelarSi,
      textoNo: TEXTOS_CITAS.confirmarCancelarNo,
    });
    if (!seguro) return;
    setCancelandoId(cita.id);
    const ok = await ejecutar(() => cancelarCita(cita.id), TEXTOS_CITAS.errorCancelar);
    if (ok) await recargar();
    setCancelandoId(null);
  };

  return {
    busqueda,
    setBusqueda,
    filtro,
    setFiltro,
    opciones,
    grupos,
    hayResultados: visibles.length > 0,
    hayCitasEnFiltro: cantidad(filtro) > 0,
    fotoDe,
    cancelar,
    cancelandoId,
    errorAccion,
    cargando,
    error,
    recargar,
    recargando,
  };
}
