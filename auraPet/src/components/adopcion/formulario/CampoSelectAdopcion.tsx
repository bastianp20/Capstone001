import type { CampoSelectAdopcionProps } from "../../../interfaces";

/** Desplegable con etiqueta y error. */
export const CampoSelectAdopcion = ({ id, etiqueta, valor, opciones, onCambiar, error, placeholder }: CampoSelectAdopcionProps) => (
  <div className="adopta-campo">
    <label htmlFor={id}>{etiqueta}</label>
    <select
      id={id}
      className={`adopta-input adopta-select ${error ? "adopta-input-error" : ""}`}
      value={valor}
      aria-invalid={!!error}
      onChange={(e) => onCambiar(e.target.value)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {opciones.map((o) => (
        <option key={o.valor} value={o.valor}>
          {o.label}
        </option>
      ))}
    </select>
    {error && <p className="adopta-campo-error">{error}</p>}
  </div>
);
