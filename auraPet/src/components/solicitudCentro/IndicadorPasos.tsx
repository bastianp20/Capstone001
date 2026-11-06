import { Iconos } from "../../constants";
import type { IndicadorPasosProps } from "../../interfaces";

// Barra de progreso del formulario por pasos: número, nombre y estado
// (completado con check, actual en color primario, siguientes en gris).
// Los pasos completados se pueden apretar para volver a ellos.
export const IndicadorPasos = ({ pasos, actual, onIrAPaso }: IndicadorPasosProps) => (
  <ol className="solicitud-pasos" aria-label="Progreso de la solicitud">
    {pasos.map((paso, i) => {
      const estado = i < actual ? "completado" : i === actual ? "actual" : "pendiente";
      return (
        <li key={paso.titulo} className={`solicitud-paso solicitud-paso--${estado}`}>
          <button
            type="button"
            className="solicitud-paso-boton"
            onClick={() => onIrAPaso(i)}
            disabled={estado !== "completado"}
            aria-current={estado === "actual" ? "step" : undefined}
          >
            <span className="solicitud-paso-numero">
              {estado === "completado" ? <Iconos.check size={14} aria-hidden="true" /> : i + 1}
            </span>
            <span className="solicitud-paso-titulo">{paso.titulo}</span>
          </button>
        </li>
      );
    })}
  </ol>
);
