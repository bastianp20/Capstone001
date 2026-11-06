import { Check } from "lucide-react";
import type { StepperVerticalProps } from "../../../interfaces";

/** Pasos en columna, con su detalle: ✓ hechos, el actual resaltado y los que faltan. */
export const StepperVertical = ({ pasos, actual }: StepperVerticalProps) => (
  <ol className="ap-stepper-vertical">
    {pasos.map((p, i) => {
      const estado = i < actual ? "hecho" : i === actual ? "actual" : "pendiente";
      return (
        <li key={p.titulo} className={`ap-sv-paso ap-sv-${estado}`} aria-current={estado === "actual" ? "step" : undefined}>
          <span className="ap-sv-circulo">{estado === "hecho" ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
          <span className="ap-sv-texto">
            <strong>{p.titulo}</strong>
            <small>{p.detalle}</small>
          </span>
        </li>
      );
    })}
  </ol>
);
