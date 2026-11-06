import { useCallback, useMemo, useState } from "react";
import { getAnimalesParaVeterinarios, getMisAtencionesAdopcion, getMisCentrosAtencion, getResumenSolidario } from "../Api/getInfo";
import { cambiarAliadoSolidario } from "../Api/postInfo";
import { FILTROS_SOLIDARIA_VACIOS, MAX_URGENTES_SOLIDARIA } from "../constants";
import type { AnimalParaVeterinario, FiltrosSolidaria, PestanaSolidaria } from "../interfaces";
import { valoresUnicos } from "../lib/publicacionesAdopcion";
import { useAccion } from "./useAccion";
import { useConsulta } from "./useConsulta";

const esperaAtencion = (a: AnimalParaVeterinario) => a.solicitaAtencion && !a.revisada;

// "Adopción solidaria" del veterinario: animales en adopción, su impacto,
// sus atenciones, sus centros, el sello de aliado y los filtros.
export const useAdopcionSolidaria = () => {
  const [recarga, setRecarga] = useState(0);
  const recargar = useCallback(() => setRecarga((n) => n + 1), []);
  const animales = useConsulta(getAnimalesParaVeterinarios, [recarga]);
  const resumen = useConsulta(getResumenSolidario, [recarga]);
  const atenciones = useConsulta(getMisAtencionesAdopcion, [recarga]);
  const centros = useConsulta(getMisCentrosAtencion, []);
  const aliado = useAccion();

  const [pestana, setPestana] = useState<PestanaSolidaria>("esperando");
  const [filtros, setFiltros] = useState<FiltrosSolidaria>(FILTROS_SOLIDARIA_VACIOS);
  const cambiarFiltros = useCallback((c: Partial<FiltrosSolidaria>) => setFiltros((f) => ({ ...f, ...c })), []);

  const todos = useMemo(() => animales.datos ?? [], [animales.datos]);
  const esperando = useMemo(() => todos.filter(esperaAtencion), [todos]);

  const visibles = useMemo(() => {
    const base = pestana === "esperando" ? esperando : todos;
    const filtrados = base.filter(
      (a) =>
        (!filtros.comuna || a.comuna === filtros.comuna) &&
        (!filtros.especie || a.especie === filtros.especie) &&
        (!filtros.soloRefugios || !!a.refugio),
    );
    return filtros.orden === "antiguos"
      ? [...filtrados].sort((a, b) => b.diasEsperando - a.diasEsperando)
      : [...filtrados].sort((a, b) => a.diasEsperando - b.diasEsperando);
  }, [pestana, esperando, todos, filtros]);

  // Los que más llevan esperando atención (primero los de su comuna)
  const urgentes = useMemo(
    () =>
      [...esperando]
        .sort((a, b) => Number(b.enMiComuna) - Number(a.enMiComuna) || b.diasEsperando - a.diasEsperando)
        .slice(0, MAX_URGENTES_SOLIDARIA),
    [esperando],
  );

  const cambiarAliado = useCallback(
    async (activo: boolean) => {
      if (await aliado.ejecutar(() => cambiarAliadoSolidario(activo), "")) recargar();
    },
    [aliado, recargar],
  );

  return {
    resumen: resumen.datos ?? null,
    atenciones: atenciones.datos ?? [],
    centros: centros.datos ?? [],
    urgentes,
    visibles,
    totalEsperando: esperando.length,
    comunas: useMemo(() => valoresUnicos(todos.map((a) => a.comuna)), [todos]),
    pestana,
    setPestana,
    filtros,
    cambiarFiltros,
    cargando: animales.cargando,
    error: animales.error,
    aliadoOcupado: aliado.ocupado,
    cambiarAliado,
    recargar,
  };
};
