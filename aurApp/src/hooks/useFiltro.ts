import { useMemo, useState } from 'react';

import type { OpcionesFiltro } from '@/interfaces';
import { normalizar } from '@/lib/texto';

// Filtro reutilizable para listas: un buscador de texto + un filtro por categoría.
// Es el mismo hook de la web (auraPet/src/hooks/useFiltro.ts).
//
//   const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro({
//     items: citas,
//     camposBusqueda: (c) => [c.motivo, c.veterinario, c.centro], // en qué textos busca
//     filtros: { todas: () => true, proximas: esProxima, pasadas: esPasada },
//     filtroInicial: 'proximas',
//   });
//
// · visibles: la lista ya filtrada (por categoría Y por texto).
// · cantidad('pasadas'): cuántos hay en esa categoría (para los números de los chips).
// Conviene definir camposBusqueda y filtros FUERA del componente, así no cambian en cada render.
export const useFiltro = <T, F extends string>({ items, camposBusqueda, filtros, filtroInicial }: OpcionesFiltro<T, F>) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<F>(filtroInicial);

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return items.filter((item) => {
      if (!filtros[filtro](item)) return false; // 1) filtro por categoría
      if (!texto) return true; // 2) sin texto, pasa
      return camposBusqueda(item).some((campo) => normalizar(campo ?? '').includes(texto));
    });
  }, [items, busqueda, filtro, filtros, camposBusqueda]);

  const cantidad = (f: F) => items.filter(filtros[f]).length;

  return { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad };
};
