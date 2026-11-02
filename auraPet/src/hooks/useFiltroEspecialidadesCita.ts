import { useMemo, useState } from "react";
import { getEspecialidades, getProfesionalesParaCita } from "../Api/getInfo";
import type { CentroParaCita } from "../interfaces";
import { cumpleEspecialidades, especialidadesFiltrables, veterinariosDe } from "../lib/especialidades";
import { useConsulta } from "./useConsulta";

// "Solicitar cita": especialidades marcadas → solo centros y profesionales que
// las tienen TODAS. Sin nada marcado se ve todo, igual que antes.
export const useFiltroEspecialidadesCita = (centros: CentroParaCita[]) => {
  const { datos: catalogo = [] } = useConsulta(getEspecialidades, []);
  const { datos: profesionales = [], cargando } = useConsulta(getProfesionalesParaCita, []);
  const [seleccion, setSeleccion] = useState<number[]>([]);

  const queCumplen = useMemo(() => profesionales.filter((p) => cumpleEspecialidades(p, seleccion)), [profesionales, seleccion]);
  const centrosVisibles = useMemo(
    () => (seleccion.length ? centros.filter((c) => queCumplen.some((p) => p.centroId === c.id)) : centros),
    [centros, queCumplen, seleccion.length],
  );

  return {
    especialidades: useMemo(() => especialidadesFiltrables(catalogo), [catalogo]),
    seleccion,
    setSeleccion,
    centrosVisibles,
    hayIndependientes: queCumplen.some((p) => p.centroId === null),
    cantidad: new Set(queCumplen.map((p) => p.veterinarioId)).size,
    sinCoincidencias: seleccion.length > 0 && !cargando && queCumplen.length === 0,
    veterinariosDe: (centroId: number | null) => veterinariosDe(queCumplen, centroId),
    cargando,
  };
};
