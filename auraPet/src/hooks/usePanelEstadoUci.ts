import { useState } from "react";
import { useEstadoUci } from "./useEstadoUci";
import { estadoUciVigente, haceCuanto } from "../lib/estadoUci";
import type { EstadoUci, MotivoUci } from "../interfaces";

// Botonera del estado de la UCI: un toque cambia el estado; "No operativa"
// primero pide el motivo.
export const usePanelEstadoUci = (centroId: number) => {
  const uci = useEstadoUci(centroId);
  const [pidiendoMotivo, setPidiendoMotivo] = useState(false);
  const [motivo, setMotivo] = useState<MotivoUci>("faltan_profesionales");
  const [detalle, setDetalle] = useState("");

  const elegir = (estado: EstadoUci) => {
    if (estado === "no_operativa") {
      setMotivo(uci.estado?.motivo ?? "faltan_profesionales");
      setDetalle(uci.estado?.detalle ?? "");
      setPidiendoMotivo(true);
      return;
    }
    setPidiendoMotivo(false);
    uci.actualizar({ estado, motivo: null, detalle: "" });
  };

  const guardarMotivo = async () => {
    await uci.actualizar({ estado: "no_operativa", motivo, detalle });
    setPidiendoMotivo(false);
  };

  return {
    ...uci,
    vigente: uci.estado ? estadoUciVigente(uci.estado.actualizadoEn, uci.ahora) : false,
    hace: uci.estado ? haceCuanto(uci.estado.actualizadoEn, uci.ahora) : null,
    elegir,
    pidiendoMotivo,
    motivo, setMotivo,
    detalle, setDetalle,
    guardarMotivo,
  };
};
