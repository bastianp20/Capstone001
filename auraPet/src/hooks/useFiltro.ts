import { useMemo, useState } from "react";
import type { OpcionesFiltro } from "../interfaces";

// Quita tildes y pasa a minúsculas: "María" -> "maria", para buscar sin importar acentos
const normalizar = (texto: string) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Filtro reutilizable para listas: un buscador de texto + un filtro por categoría.
//
//   const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro({
//     items: usuarios,
//     camposBusqueda: (u) => [u.nombre, u.email],      // en qué textos busca
//     filtros: { todos: () => true, prueba: (u) => u.es_prueba },
//     filtroInicial: "todos",
//   });
//
// · visibles: la lista ya filtrada (por categoría Y por texto).
// · cantidad("prueba"): cuántos hay en esa categoría (para los números de los chips).
// Conviene definir camposBusqueda y filtros FUERA del componente, así no cambian en cada render.
export const useFiltro = <T, F extends string>({ items, camposBusqueda, filtros, filtroInicial }: OpcionesFiltro<T, F>) => {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<F>(filtroInicial);

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return items.filter((item) => {
      if (!filtros[filtro](item)) return false;          // 1) filtro por categoría
      if (!texto) return true;                            // 2) sin texto, pasa
      return camposBusqueda(item).some((campo) => normalizar(campo ?? "").includes(texto));
    });
  }, [items, busqueda, filtro, filtros, camposBusqueda]);

  const cantidad = (f: F) => items.filter(filtros[f]).length;

  return { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad };
};
