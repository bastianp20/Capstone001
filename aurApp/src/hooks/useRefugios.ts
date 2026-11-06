import { useMemo, useState } from 'react';

import { getRefugios, getResumenRefugios } from '@/Api/getInfo';
import { TEXTOS_REFUGIOS as T } from '@/constants/constants';
import type { ContactoPersona, FiltroRefugios, Refugio } from '@/interfaces';
import { normalizar } from '@/lib/texto';

import { useCargaDatos } from './useCargaDatos';

const FILTROS: Record<FiltroRefugios, (r: Refugio) => boolean> = {
  todos: () => true,
  abiertos: (r) => r.recibe !== 'sin_cupos',
  perros: (r) => r.especies.includes('perro'),
  gatos: (r) => r.especies.includes('gato'),
};

const cargarRefugios = async () => {
  const [lista, resumen] = await Promise.all([getRefugios(), getResumenRefugios()]);
  return { lista, resumen };
};

/** Pestaña Refugios de Adopta: lista, búsqueda, filtro y la hoja para contactarlos. */
export function useRefugios() {
  const carga = useCargaDatos(cargarRefugios, []);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<FiltroRefugios>('todos');
  const [contacto, setContacto] = useState<ContactoPersona | null>(null);

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return (carga.datos?.lista ?? []).filter(
      (r) => FILTROS[filtro](r) && (!texto || [r.nombre, r.comuna, r.region].some((c) => normalizar(c).includes(texto))),
    );
  }, [carga.datos, busqueda, filtro]);

  const resumen = carga.datos?.resumen;
  const cifras = resumen
    ? [
        { valor: resumen.refugios, texto: T.cifras.refugios },
        { valor: resumen.animales, texto: T.cifras.animales },
        { valor: resumen.aliados, texto: T.cifras.aliados },
      ]
    : [];

  return {
    cargando: carga.cargando,
    error: carga.error,
    recargar: carga.recargar,
    recargando: carga.recargando,
    hayRefugios: !!carga.datos?.lista.length,
    cifras,
    busqueda,
    setBusqueda,
    filtro,
    setFiltro,
    visibles,
    contacto,
    contactar: (r: Refugio) =>
      setContacto({ nombre: r.nombre, telefono: r.telefono, correo: r.correo, mensajeWhatsapp: T.whatsappTexto(r.nombre), asuntoCorreo: T.correoAsunto }),
    cerrarContacto: () => setContacto(null),
  };
}
