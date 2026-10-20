import { badgeStyles } from "../../constants";
import type { EtiquetaCitaProps } from "../../interfaces";
import { Etiqueta } from "./Etiqueta";

// Etiqueta con los colores de estado/urgencia de cita (badgeStyles), sin estilos en línea.
export const EtiquetaCita = ({ valor, texto }: EtiquetaCitaProps) => {
  const estilo = badgeStyles[valor];
  return <Etiqueta texto={texto} fondo={String(estilo?.background ?? "#eceef1")} color={String(estilo?.color ?? "#4b5563")} />;
};
