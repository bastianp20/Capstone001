import { Check } from "lucide-react";
import { Fragment } from "react";
import type { StepperCirculosProps } from "../../../interfaces";

/** Pasos numerados en círculos unidos por una línea: ① Datos — ② Capacidad — ③ … */
export const StepperCirculos = ({ pasos, actual }: StepperCirculosProps) => (
  <ol className="ap-stepper">
    {pasos.map((p, i) => {
      const estado = i < actual ? "hecho" : i === actual ? "actual" : "pendiente";
      return (
        <Fragment key={p}>
          {i > 0 && <li className={`ap-stepper-linea ${i <= actual ? "ap-stepper-linea-hecha" : ""}`} aria-hidden />}
          <li className={`ap-stepper-paso ap-stepper-${estado}`} aria-current={estado === "actual" ? "step" : undefined}>
            <span className="ap-stepper-circulo">{estado === "hecho" ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
            <span className="ap-stepper-texto">{p}</span>
          </li>
        </Fragment>
      );
    })}
  </ol>
);
