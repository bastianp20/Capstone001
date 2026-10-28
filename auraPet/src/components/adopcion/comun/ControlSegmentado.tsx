import type { ControlSegmentadoProps } from "../../../interfaces";

/** Opciones excluyentes en una barra (con ícono opcional): Sano · En tratamiento · En observación. */
export const ControlSegmentado = <V extends string>({ etiqueta, opciones, valor, onCambiar }: ControlSegmentadoProps<V>) => (
  <fieldset className="adopta-campo">
    <legend>{etiqueta}</legend>
    <div className="ap-segmentado" role="radiogroup" aria-label={etiqueta}>
      {opciones.map(({ valor: v, label, icono: Icono }) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={valor === v}
          className={`ap-segmento ${valor === v ? "ap-segmento-activo" : ""}`}
          onClick={() => onCambiar(v)}
        >
          {Icono && <Icono size={20} aria-hidden />}
          <span>{label}</span>
        </button>
      ))}
    </div>
  </fieldset>
);
