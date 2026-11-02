import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import type { TarjetaMotivoReporteProps } from "../../../interfaces";

/** Una opción de "¿Qué está pasando?": cuadrito de color con su ícono y el título. */
export const TarjetaMotivoReporte = ({ opcion, activa, onElegir }: TarjetaMotivoReporteProps) => {
  const { icono: Icono } = opcion;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={activa}
      className={`rep-motivo ${activa ? "rep-motivo-activo" : ""}`}
      style={{ "--rep-color": opcion.color, "--rep-fondo": opcion.fondo } as CSSProperties}
      onClick={() => onElegir(opcion.valor)}
    >
      <span className="rep-motivo-icono" aria-hidden>
        <Icono size={20} />
      </span>
      <span>{opcion.label}</span>
      {activa && (
        <span className="rep-motivo-check" aria-hidden>
          <Check size={12} strokeWidth={3} />
        </span>
      )}
    </button>
  );
};
