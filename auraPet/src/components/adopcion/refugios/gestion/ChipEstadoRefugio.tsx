import { ESTADO_REFUGIO_LABEL } from "../../../../constants";
import type { ChipEstadoRefugioProps } from "../../../../interfaces";

/** Verificado · Por revisar · Rechazado */
export const ChipEstadoRefugio = ({ estado }: ChipEstadoRefugioProps) => (
  <span className={`ap-chip ap-chip-refugio-${estado}`}>{ESTADO_REFUGIO_LABEL[estado]}</span>
);
