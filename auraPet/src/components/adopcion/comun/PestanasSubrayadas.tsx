import type { PestanasSubrayadasProps } from "../../../interfaces";

/** Pestañas con subrayado (más livianas que las píldoras). Opcionalmente con contador. */
export const PestanasSubrayadas = <V extends string>({ opciones, valor, onCambiar, etiqueta }: PestanasSubrayadasProps<V>) => (
  <div className="ap-pestanas" role="tablist" aria-label={etiqueta}>
    {opciones.map((o) => (
      <button
        key={o.valor}
        type="button"
        role="tab"
        aria-selected={valor === o.valor}
        className={`ap-pestana ${valor === o.valor ? "ap-pestana-activa" : ""}`}
        onClick={() => onCambiar(o.valor)}
      >
        {o.label}
        {o.cantidad !== undefined && <span className="ap-pestana-contador">{o.cantidad}</span>}
      </button>
    ))}
  </div>
);
