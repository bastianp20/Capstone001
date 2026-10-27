import type { InterruptorAdopcionProps } from "../../../interfaces";

/** Interruptor encendido/apagado con su texto (accesible: es un checkbox). */
export const InterruptorAdopcion = ({ etiqueta, activo, onCambiar }: InterruptorAdopcionProps) => (
  <label className="adopta-interruptor">
    <input type="checkbox" checked={activo} onChange={(e) => onCambiar(e.target.checked)} />
    <span className="adopta-interruptor-riel" aria-hidden />
    {etiqueta}
  </label>
);
