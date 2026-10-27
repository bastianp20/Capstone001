import type { CampoTextoAdopcionProps } from "../../../interfaces";

/** Campo de texto (una línea o varias) con etiqueta, ayuda, contador y error. */
export const CampoTextoAdopcion = ({
  id, etiqueta, valor, onCambiar, error, placeholder, multilinea = false, maximo, tipo = "text", ayuda,
}: CampoTextoAdopcionProps) => {
  const comunes = {
    id,
    value: valor,
    placeholder,
    maxLength: maximo,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: `adopta-input ${error ? "adopta-input-error" : ""}`,
  };
  return (
    <div className="adopta-campo">
      <label htmlFor={id}>{etiqueta}</label>
      {multilinea ? (
        <textarea {...comunes} rows={4} onChange={(e) => onCambiar(e.target.value)} />
      ) : (
        <input {...comunes} type={tipo} inputMode={tipo === "number" ? "decimal" : undefined} min={tipo === "number" ? 0 : undefined} onChange={(e) => onCambiar(e.target.value)} />
      )}
      <div className="adopta-campo-pie">
        {error ? <p id={`${id}-error`} className="adopta-campo-error">{error}</p> : ayuda ? <p className="adopta-campo-ayuda">{ayuda}</p> : <span />}
        {maximo && multilinea && <span className="adopta-campo-contador">{valor.length}/{maximo}</span>}
      </div>
    </div>
  );
};
