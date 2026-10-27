import type { IndicadorPasosAdopcionProps } from "../../../interfaces";

/** Barra de avance y nombres de los pasos: "Tu hogar · Tu familia · …". */
export const IndicadorPasosAdopcion = ({ pasos, actual }: IndicadorPasosAdopcionProps) => (
  <div className="adopta-pasos-indicador">
    <div className="adopta-pasos-barra" aria-hidden>
      <span style={{ width: `${((actual + 1) / pasos.length) * 100}%` }} />
    </div>
    <ol>
      {pasos.map((p, i) => (
        <li
          key={p}
          className={i === actual ? "adopta-paso-actual" : i < actual ? "adopta-paso-hecho" : ""}
          aria-current={i === actual ? "step" : undefined}
        >
          {p}
        </li>
      ))}
    </ol>
  </div>
);
