import { useMemo, useState } from "react";
import { getDestinosDerivacion, getEspecialidades } from "../Api/getInfo";
import { especialidadesFiltrables } from "../lib/especialidades";
import { useConsulta } from "./useConsulta";

// "Derivar paciente": a quién se puede derivar y el filtro por especialidades
// (solo quedan veterinarios y centros que tengan TODAS las marcadas).
export const useDestinosDerivacion = () => {
  const { datos: destinos = [], cargando, error } = useConsulta(getDestinosDerivacion, []);
  const { datos: catalogo = [] } = useConsulta(getEspecialidades, []);
  const [seleccion, setSeleccion] = useState<number[]>([]);

  const visibles = useMemo(
    () => destinos.filter((d) => seleccion.every((id) => d.especialidadIds.includes(id))),
    [destinos, seleccion],
  );

  return {
    especialidades: useMemo(() => especialidadesFiltrables(catalogo), [catalogo]),
    seleccion,
    setSeleccion,
    veterinarios: visibles.filter((d) => d.tipo === "veterinario"),
    centros: visibles.filter((d) => d.tipo === "centro"),
    sinCoincidencias: seleccion.length > 0 && !cargando && visibles.length === 0,
    cargando,
    error,
  };
};
