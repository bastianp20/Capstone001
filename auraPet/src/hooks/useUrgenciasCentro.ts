import { useState } from "react";
import { guardarUrgenciasCentro } from "../Api/postInfo";
import { useAccion } from "./useAccion";
import type { CentroDetalle } from "../interfaces";

// Lo fijo de urgencias: si el centro tiene UCI y si atiende urgencias 24/7.
export const useUrgenciasCentro = (centro: CentroDetalle, onGuardado: () => void) => {
  const [tieneUci, setTieneUci] = useState(centro.tieneUci);
  const [urgencias247, setUrgencias247] = useState(centro.urgencias247);
  const [guardado, setGuardado] = useState(false);
  const { ejecutar, ocupado, error } = useAccion();

  const cambiado = !centro.urgenciasRevisadas || tieneUci !== centro.tieneUci || urgencias247 !== centro.urgencias247;

  const guardar = async () => {
    if (await ejecutar(() => guardarUrgenciasCentro(centro.id, tieneUci, urgencias247), "No se pudo guardar.")) {
      setGuardado(true);
      onGuardado();
    }
  };

  const con = (setter: (v: boolean) => void) => (v: boolean) => { setGuardado(false); setter(v); };

  return {
    tieneUci, setTieneUci: con(setTieneUci),
    urgencias247, setUrgencias247: con(setUrgencias247),
    cambiado, guardar, guardado, ocupado, error,
  };
};
