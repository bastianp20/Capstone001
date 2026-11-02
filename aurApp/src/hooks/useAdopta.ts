import { useMemo, useState } from 'react';

import { getAnimalesAdopcion, getResumenAdopciones } from '@/Api/getInfo';
import { FILTROS_ADOPCION_VACIOS, TEXTOS_ADOPTA as T } from '@/constants/constants';
import type { FiltroEspecieAdopcion, FiltroHojaAdopcion, FiltrosAdopcion, Refugio, VistaAdopta } from '@/interfaces';
import { contarFiltrosHoja, cumpleFiltrosAdopcion, valoresUnicos } from '@/lib/adopcion';
import { normalizar } from '@/lib/texto';

import { useCargaDatos } from './useCargaDatos';
import { useGuardadosAdopcion } from './useGuardadosAdopcion';
import { useRecargarAlVolver } from './useRecargarAlVolver';

const cargarAdopta = async () => {
  const [animales, resumen] = await Promise.all([getAnimalesAdopcion(), getResumenAdopciones()]);
  return { animales, resumen };
};

/** Adopta: animales con búsqueda, especie, "Filtros" (hoja), guardados y "Ver sus animales" de un refugio. */
export function useAdopta() {
  const carga = useCargaDatos(cargarAdopta, []);
  useRecargarAlVolver(carga.recargar);
  const { guardados, estaGuardado, alternar } = useGuardadosAdopcion();

  const [vista, setVista] = useState<VistaAdopta>('animales');
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState<FiltrosAdopcion>(FILTROS_ADOPCION_VACIOS);
  const [refugioActivo, setRefugioActivo] = useState<string | null>(null);
  const [hojaAbierta, setHojaAbierta] = useState(false);

  const animales = useMemo(() => carga.datos?.animales ?? [], [carga.datos]);
  const comunas = useMemo(() => valoresUnicos(animales.map((a) => a.comuna)), [animales]);

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return animales.filter(
      (a) => cumpleFiltrosAdopcion(a, filtros, guardados) && (!texto || [a.nombre, a.raza, a.comuna].some((c) => normalizar(c).includes(texto))),
    );
  }, [animales, filtros, guardados, busqueda]);

  const cambiarFiltro = <K extends FiltroHojaAdopcion>(campo: K, valor: FiltrosAdopcion[K]) => setFiltros((f) => ({ ...f, [campo]: valor }));

  const resumen = carga.datos?.resumen;
  const cifras = resumen
    ? [
        { valor: resumen.esperando, texto: T.cifras.esperando },
        { valor: resumen.revisados, texto: T.cifras.revisados },
        { valor: resumen.conFamilia, texto: T.cifras.conFamilia },
      ]
    : [];

  const mensajeVacio = !animales.length ? T.sinPublicaciones : filtros.soloGuardados && !guardados.size ? T.sinGuardados : T.sinResultados;

  return {
    vista,
    setVista,
    cargando: carga.cargando,
    error: carga.error,
    recargando: carga.recargando,
    recargar: carga.recargar,
    cifras,
    busqueda,
    setBusqueda,
    filtros,
    setEspecie: (especie: FiltroEspecieAdopcion) => setFiltros((f) => ({ ...f, especie })),
    cambiarFiltro,
    limpiarFiltros: () => setFiltros((f) => ({ ...FILTROS_ADOPCION_VACIOS, especie: f.especie, refugioId: f.refugioId })),
    filtrosEnHoja: contarFiltrosHoja(filtros),
    comunas,
    visibles,
    mensajeVacio,
    hojaAbierta,
    abrirHoja: () => setHojaAbierta(true),
    cerrarHoja: () => setHojaAbierta(false),
    estaGuardado,
    alternarGuardado: alternar,
    refugioActivo,
    verAnimalesDe: (r: Refugio) => {
      setFiltros({ ...FILTROS_ADOPCION_VACIOS, refugioId: r.id });
      setRefugioActivo(r.nombre);
      setBusqueda('');
      setVista('animales');
    },
    quitarRefugio: () => {
      setFiltros((f) => ({ ...f, refugioId: null }));
      setRefugioActivo(null);
    },
  };
}
