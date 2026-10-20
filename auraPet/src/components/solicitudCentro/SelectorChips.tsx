import type { SelectorChipsProps } from "../../interfaces";

// Chips seleccionables. multiple = varios a la vez (checkbox);
// si no, uno solo (radio). Sirve para especialidades, cargos, etc.
export const SelectorChips = <T extends string | number>({
  etiqueta, opciones, seleccion, multiple = false, opcional, error, id, onCambiar,
}: SelectorChipsProps<T>) => {
  const alternar = (valor: T) => {
    if (!multiple) return onCambiar([valor]);
    onCambiar(seleccion.includes(valor) ? seleccion.filter((v) => v !== valor) : [...seleccion, valor]);
  };

  return (
    <fieldset className={`solicitud-campo solicitud-chips-grupo ${error ? "solicitud-campo--error" : ""}`}
      aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="solicitud-etiqueta">
        {etiqueta}
        {opcional ? <span className="solicitud-opcional">(opcional)</span> : <span className="solicitud-requerido" aria-hidden="true">*</span>}
      </legend>
      <div className="solicitud-chips" role={multiple ? "group" : "radiogroup"}>
        {opciones.map((o, i) => {
          const activo = seleccion.includes(o.valor);
          return (
            <button
              key={String(o.valor)}
              id={i === 0 ? id : undefined}       // el primero recibe el foco si hay error
              type="button"
              role={multiple ? "checkbox" : "radio"}
              aria-checked={activo}
              className={`solicitud-chip ${activo ? "solicitud-chip--activo" : ""}`}
              onClick={() => alternar(o.valor)}
            >
              {o.texto}
            </button>
          );
        })}
      </div>
      {error && <p id={`${id}-error`} className="solicitud-error">{error}</p>}
    </fieldset>
  );
};
