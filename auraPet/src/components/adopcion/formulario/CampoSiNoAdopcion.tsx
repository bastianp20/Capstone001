import { TEXTOS_POSTULACION as T } from "../../../constants";
import type { CampoSiNoAdopcionProps } from "../../../interfaces";

/** Pregunta de sí o no con dos píldoras (empieza sin respuesta). */
export const CampoSiNoAdopcion = ({ etiqueta, valor, onCambiar, error }: CampoSiNoAdopcionProps) => (
  <fieldset className="adopta-campo adopta-campo-sino">
    <legend>{etiqueta}</legend>
    <div className="adopta-grupo-opciones">
      {[true, false].map((opcion) => (
        <button
          key={String(opcion)}
          type="button"
          className={`adopta-pildora ${valor === opcion ? "adopta-pildora-activa" : ""}`}
          aria-pressed={valor === opcion}
          onClick={() => onCambiar(opcion)}
        >
          {opcion ? T.si : T.no}
        </button>
      ))}
    </div>
    {error && <p className="adopta-campo-error">{error}</p>}
  </fieldset>
);
