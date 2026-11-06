import { useState } from "react";
import { getMisBloqueos } from "../Api/getInfo";
import { quitarBloqueo } from "../Api/postInfo";
import { useConsulta } from "./useConsulta";
import { useAccion } from "./useAccion";
import type { BloqueoHorario } from "../interfaces";

// Bloqueos del veterinario conectado para la pestaña "Mi horario".
// · recargaExterna: sube cuando la agenda cambió (bloqueo nuevo, cita movida).
export const useMiHorario = (recargaExterna: number) => {
  const [recarga, setRecarga] = useState(0);
  const { datos: bloqueos = [], cargando, error } = useConsulta(getMisBloqueos, [recarga, recargaExterna]);
  const { ejecutar, ocupado, error: errorAccion } = useAccion();

  const quitar = async (bloqueo: BloqueoHorario) => {
    if (await ejecutar(() => quitarBloqueo(bloqueo.id), "No se pudo quitar el bloqueo.")) {
      setRecarga((n) => n + 1);
    }
  };

  return { bloqueos, cargando, error: errorAccion ?? error ?? null, quitar, ocupado };
};
