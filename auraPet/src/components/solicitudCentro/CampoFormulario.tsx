import type { CampoFormularioProps } from "../../interfaces";
import { ContadorCaracteres } from "../ui/ContadorCaracteres";

// Campo de texto con label, prefijo opcional (p. ej. "+56"), datalist,
// contador de caracteres y error en línea accesible.
export const CampoFormulario = ({
  campo, etiqueta, valor, error, opcional, placeholder, prefijo, tipo = "text",
  multilinea, maxLength, sugerencias, inputMode, onCambiar, onSalir,
}: CampoFormularioProps) => {
  const id = `solicitud-${campo}`;
  const idError = `${id}-error`;
  const idLista = sugerencias ? `${id}-sugerencias` : undefined;
  const comunes = {
    id,
    value: valor,
    placeholder,
    maxLength,
    onBlur: onSalir,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? idError : undefined,
    className: "solicitud-control",
  };

  return (
    <div className={`solicitud-campo ${error ? "solicitud-campo--error" : ""}`}>
      <label htmlFor={id} className="solicitud-etiqueta">
        {etiqueta}
        {opcional ? <span className="solicitud-opcional">(opcional)</span> : <span className="solicitud-requerido" aria-hidden="true">*</span>}
      </label>

      {multilinea ? (
        <textarea {...comunes} rows={4} onChange={(e) => onCambiar(e.target.value)} />
      ) : (
        <div className={`solicitud-input ${prefijo ? "solicitud-input--prefijo" : ""}`}>
          {prefijo && <span className="solicitud-prefijo">{prefijo}</span>}
          <input {...comunes} type={tipo} inputMode={inputMode} list={idLista} onChange={(e) => onCambiar(e.target.value)} />
        </div>
      )}

      {sugerencias && (
        <datalist id={idLista}>
          {sugerencias.map((s) => <option key={s} value={s} />)}
        </datalist>
      )}
      {multilinea && maxLength && <ContadorCaracteres actual={valor.length} maximo={maxLength} />}
      {error && <p id={idError} className="solicitud-error">{error}</p>}
    </div>
  );
};
