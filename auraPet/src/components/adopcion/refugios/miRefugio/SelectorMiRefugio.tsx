import { TEXTOS_MI_REFUGIO as T } from "../../../../constants";
import type { SelectorMiRefugioProps } from "../../../../interfaces";

/** Si administra más de un refugio, elige cuál ver. */
export const SelectorMiRefugio = ({ refugios, valor, onCambiar }: SelectorMiRefugioProps) => (
  <select className="ap-select mr-selector" value={valor} onChange={(e) => onCambiar(Number(e.target.value))} aria-label={T.refugio}>
    {refugios.map((r) => (
      <option key={r.id} value={r.id}>
        {r.nombre}
      </option>
    ))}
  </select>
);
