import { useState } from "react";
import { reportarAdopcion } from "../Api/postInfo";
import { numeroReporte, TEXTOS_REPORTE as T } from "../constants";
import type { MotivoReporte } from "../interfaces";
import { useAccion } from "./useAccion";

// "Reportar publicación": el motivo, el comentario y el envío (devuelve el n.º de reporte).
export const useReportarAdopcion = (adopcionId: number) => {
  const [motivo, setMotivo] = useState<MotivoReporte | null>(null);
  const [comentario, setComentario] = useState("");
  const [numero, setNumero] = useState<string | null>(null);
  const [intentado, setIntentado] = useState(false);
  const { ejecutar, ocupado, error } = useAccion();

  const enviar = async () => {
    setIntentado(true);
    if (!motivo) return;
    await ejecutar(async () => setNumero(numeroReporte(await reportarAdopcion(adopcionId, motivo, comentario))), T.error);
  };

  return {
    motivo,
    setMotivo,
    comentario,
    setComentario,
    enviar,
    ocupado,
    error: error ?? (intentado && !motivo ? T.faltaMotivo : null),
    numero,
  };
};
