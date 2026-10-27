import type { GrupoOpcionesAdopcionProps } from "../../interfaces";

/** Grupo de píldoras de una sola opción (Tamaño, Edad, Sexo). Tocar la activa la quita. */
export const GrupoOpcionesAdopcion = <V extends string>({ titulo, opciones, valor, onElegir }: GrupoOpcionesAdopcionProps<V>) => (
  <fieldset className="adopta-grupo">
    <legend>{titulo}</legend>
    <div className="adopta-grupo-opciones">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          className={`adopta-pildora ${valor === o.valor ? "adopta-pildora-activa" : ""}`}
          aria-pressed={valor === o.valor}
          onClick={() => onElegir(valor === o.valor ? null : o.valor)}
        >
          {o.label}
        </button>
      ))}
    </div>
  </fieldset>
);
