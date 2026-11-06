import { NIVEL_MAXIMO_RASGO } from "../../../constants";
import type { BarraRasgoAdopcionProps } from "../../../interfaces";

/** "Energía ▓▓▓▓░" — nivel de 1 a 5. */
export const BarraRasgoAdopcion = ({ etiqueta, valor }: BarraRasgoAdopcionProps) => (
  <div className="ficha-rasgo">
    <span>{etiqueta}</span>
    <div
      className="ficha-rasgo-barra"
      role="meter"
      aria-label={etiqueta}
      aria-valuemin={1}
      aria-valuemax={NIVEL_MAXIMO_RASGO}
      aria-valuenow={valor ?? 0}
    >
      <span style={{ width: `${((valor ?? 0) / NIVEL_MAXIMO_RASGO) * 100}%` }} />
    </div>
  </div>
);
