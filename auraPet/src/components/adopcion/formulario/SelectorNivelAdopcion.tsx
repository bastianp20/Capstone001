import { NIVEL_MAXIMO_RASGO, TEXTOS_PUBLICAR as T } from "../../../constants";
import type { SelectorNivelAdopcionProps } from "../../../interfaces";

/** Elegir un nivel de 1 a 5 (o "No sé") para un rasgo: Energía, Con gatos… */
export const SelectorNivelAdopcion = ({ etiqueta, valor, onCambiar }: SelectorNivelAdopcionProps) => (
  <fieldset className="adopta-nivel">
    <legend>{etiqueta}</legend>
    <div className="adopta-nivel-opciones">
      {Array.from({ length: NIVEL_MAXIMO_RASGO }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={`adopta-nivel-punto ${valor !== null && n <= valor ? "adopta-nivel-lleno" : ""}`}
          aria-pressed={valor === n}
          aria-label={`${etiqueta}: ${n} de ${NIVEL_MAXIMO_RASGO}`}
          onClick={() => onCambiar(n)}
        >
          {n}
        </button>
      ))}
      <button type="button" className={`adopta-nivel-nose ${valor === null ? "adopta-nivel-nose-activo" : ""}`} onClick={() => onCambiar(null)}>
        {T.sinDato}
      </button>
    </div>
  </fieldset>
);
