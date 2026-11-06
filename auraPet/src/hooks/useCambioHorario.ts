import { useState } from "react";
import { MOTIVOS_CAMBIO_HORA } from "../constants";

// Estado compartido de los modales "Modificar cita" y "Bloquear horario":
// motivo (chips + detalle), mensaje para el dueño y si se avisa al centro.
// El mensaje sugerido se escribe solo hasta que la persona lo edita.
export const useCambioHorario = (mensajeSugerido: string) => {
  const [motivo, setMotivo] = useState<string>(MOTIVOS_CAMBIO_HORA[0]);
  const [detalleMotivo, setDetalleMotivo] = useState("");
  const [mensajeEditado, setMensajeEditado] = useState<string | null>(null);
  const [avisarCentro, setAvisarCentro] = useState(true);

  // "Otro" sin detalle no dice nada: en ese caso el detalle es obligatorio
  const motivoFinal = detalleMotivo.trim()
    ? (motivo === "Otro" ? detalleMotivo.trim() : `${motivo}: ${detalleMotivo.trim()}`)
    : (motivo === "Otro" ? "" : motivo);

  return {
    motivo, setMotivo,
    detalleMotivo, setDetalleMotivo,
    mensaje: mensajeEditado ?? mensajeSugerido,
    setMensaje: setMensajeEditado,
    avisarCentro, setAvisarCentro,
    motivoFinal,
  };
};
