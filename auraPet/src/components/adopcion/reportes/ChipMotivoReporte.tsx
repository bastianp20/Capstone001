import type { CSSProperties } from "react";
import { MOTIVO_REPORTE } from "../../../constants";
import type { ChipMotivoReporteProps } from "../../../interfaces";

/** Chip del motivo de un reporte, con su color e ícono. */
export const ChipMotivoReporte = ({ motivo }: ChipMotivoReporteProps) => {
  const { label, icono: Icono, color, fondo } = MOTIVO_REPORTE[motivo];
  return (
    <span className="mod-chip" style={{ "--mod-color": color, "--mod-fondo": fondo } as CSSProperties}>
      <Icono size={13} aria-hidden /> {label}
    </span>
  );
};
