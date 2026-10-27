import { useMemo, useState } from 'react';

import { FILTROS_HISTORIAL, TEXTOS_HISTORIAL, TODAS_LAS_MASCOTAS } from '@/constants/constants';
import { useDatosDueno } from '@/context/DatosDuenoContext';
import type { FiltroHistorial, ItemHistorial } from '@/interfaces';
import { agruparPorMes, armarLineaDeTiempo, camposBusquedaHistorial, FILTROS_TIPO_HISTORIAL } from '@/lib/historial';

import { useDescargaFicha } from './useDescargaFicha';
import { useFiltro } from './useFiltro';

/** Pestaña Historial: mascota elegida, filtro por tipo, línea de tiempo y ficha PDF. */
export function useHistorial() {
  const { mascotas, registros, recetas, derivaciones, cargando, error, recargar, recargando } = useDatosDueno();
  const [mascotaElegida, setMascotaElegida] = useState<string>(TODAS_LAS_MASCOTAS);
  const [avisoPdf, setAvisoPdf] = useState('');
  const ficha = useDescargaFicha();

  const todos = useMemo(() => armarLineaDeTiempo(registros, recetas, derivaciones), [registros, recetas, derivaciones]);
  const deLaMascota = useMemo(
    () => (mascotaElegida === TODAS_LAS_MASCOTAS ? todos : todos.filter((i) => String(i.mascotaId) === mascotaElegida)),
    [todos, mascotaElegida],
  );

  const { filtro, setFiltro, visibles, cantidad } = useFiltro<ItemHistorial, FiltroHistorial>({
    items: deLaMascota,
    camposBusqueda: camposBusquedaHistorial,
    filtros: FILTROS_TIPO_HISTORIAL,
    filtroInicial: 'todo',
  });

  const grupos = useMemo(() => agruparPorMes(visibles), [visibles]);
  const opcionesTipo = FILTROS_HISTORIAL.map((o) => ({ ...o, cantidad: cantidad(o.valor) }));
  const opcionesMascota = [
    { valor: TODAS_LAS_MASCOTAS, texto: TEXTOS_HISTORIAL.todas },
    ...mascotas.map((m) => ({ valor: String(m.id), texto: m.nombre })),
  ];

  // Con "Todas" y una sola mascota, la ficha es de esa; con varias, hay que elegir.
  const idParaPdf = mascotaElegida !== TODAS_LAS_MASCOTAS ? Number(mascotaElegida) : mascotas.length === 1 ? mascotas[0].id : null;

  const descargarFicha = () => {
    ficha.limpiarError();
    if (idParaPdf === null) return setAvisoPdf(TEXTOS_HISTORIAL.elegirMascotaPdf);
    setAvisoPdf('');
    ficha.descargar(idParaPdf);
  };

  const elegirMascota = (valor: string) => {
    setMascotaElegida(valor);
    setAvisoPdf('');
  };

  return {
    mascotaElegida,
    elegirMascota,
    opcionesMascota,
    filtro,
    setFiltro,
    opcionesTipo,
    grupos,
    hayRegistros: deLaMascota.length > 0,
    mostrarMascota: mascotaElegida === TODAS_LAS_MASCOTAS && mascotas.length > 1,
    hayMascotas: mascotas.length > 0,
    descargarFicha,
    generandoPdf: ficha.generando,
    avisoPdf,
    errorPdf: ficha.error,
    cargando,
    error,
    recargar,
    recargando,
  };
}
