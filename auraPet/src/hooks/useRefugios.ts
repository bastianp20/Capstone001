import { useCallback, useMemo, useState } from "react";
import { getRefugios, getResumenRefugios } from "../Api/getInfo";
import { FILTROS_REFUGIOS_VACIOS } from "../constants";
import type { FiltrosRefugios } from "../interfaces";
import { valoresUnicos } from "../lib/publicacionesAdopcion";
import { useConsulta } from "./useConsulta";

// Página de Refugios: la lista, los números, los que necesitan ayuda y los filtros.
export const useRefugios = () => {
  const lista = useConsulta(getRefugios, []);
  const resumen = useConsulta(getResumenRefugios, []);
  const [filtros, setFiltros] = useState<FiltrosRefugios>(FILTROS_REFUGIOS_VACIOS);
  const cambiarFiltros = useCallback((c: Partial<FiltrosRefugios>) => setFiltros((f) => ({ ...f, ...c })), []);

  const refugios = useMemo(() => lista.datos ?? [], [lista.datos]);
  const visibles = useMemo(
    () =>
      refugios.filter(
        (r) =>
          (!filtros.region || r.region === filtros.region) &&
          (!filtros.comuna || r.comuna === filtros.comuna) &&
          (!filtros.soloAbiertos || r.recibe !== "sin_cupos") &&
          (!filtros.especie || r.especies.includes(filtros.especie)),
      ),
    [refugios, filtros],
  );

  return {
    refugios,
    visibles,
    resumen: resumen.datos ?? null,
    necesitanAyuda: useMemo(() => refugios.filter((r) => r.recibe !== "abierto"), [refugios]),
    regiones: useMemo(() => valoresUnicos(refugios.map((r) => r.region)), [refugios]),
    comunas: useMemo(
      () => valoresUnicos(refugios.filter((r) => !filtros.region || r.region === filtros.region).map((r) => r.comuna)),
      [refugios, filtros.region],
    ),
    filtros,
    cambiarFiltros,
    cargando: lista.cargando,
    error: lista.error,
  };
};
