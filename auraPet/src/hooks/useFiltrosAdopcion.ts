import { useMemo, useState } from "react";
import { CAMPOS_BUSQUEDA_ADOPCION, FILTROS_ESPECIE_ADOPCION, FILTROS_EXTRA_ADOPCION_VACIOS } from "../constants";
import type { AnimalAdopcion, FiltroEspecieAdopcion, FiltrosExtraAdopcion } from "../interfaces";
import { comunasDe, contarFiltrosPanel, cumpleFiltrosExtra } from "../lib/adopcion";
import { useFiltro } from "./useFiltro";

// Filtros de /adopta: especie y buscador (con useFiltro), más el interruptor
// "Solo revisados por veterinario" y los del panel "Más filtros".
export const useFiltrosAdopcion = (animales: AnimalAdopcion[]) => {
  const base = useFiltro<AnimalAdopcion, FiltroEspecieAdopcion>({
    items: animales,
    camposBusqueda: CAMPOS_BUSQUEDA_ADOPCION,
    filtros: FILTROS_ESPECIE_ADOPCION,
    filtroInicial: "todos",
  });
  const [extra, setExtra] = useState<FiltrosExtraAdopcion>(FILTROS_EXTRA_ADOPCION_VACIOS);
  const [panelAbierto, setPanelAbierto] = useState(false);

  const visibles = useMemo(() => base.visibles.filter((a) => cumpleFiltrosExtra(a, extra)), [base.visibles, extra]);
  const comunas = useMemo(() => comunasDe(animales), [animales]);

  return {
    especie: base.filtro,
    setEspecie: base.setFiltro,
    busqueda: base.busqueda,
    setBusqueda: base.setBusqueda,
    extra,
    cambiarExtra: (cambios: Partial<FiltrosExtraAdopcion>) => setExtra((f) => ({ ...f, ...cambios })),
    limpiar: () => {
      base.setFiltro("todos");
      base.setBusqueda("");
      setExtra(FILTROS_EXTRA_ADOPCION_VACIOS);
    },
    filtrosPanel: contarFiltrosPanel(extra, base.busqueda),
    comunas,
    visibles,
    panelAbierto,
    abrirPanel: () => setPanelAbierto(true),
    cerrarPanel: () => setPanelAbierto(false),
  };
};
