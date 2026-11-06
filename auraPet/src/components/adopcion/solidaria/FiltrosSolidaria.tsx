import { OPCIONES_ESPECIE_ADOPCION, TEXTOS_SOLIDARIA as T } from "../../../constants";
import type { EspecieAdopcion, FiltrosSolidariaProps, OrdenSolidaria } from "../../../interfaces";
import { InterruptorAdopcion } from "../formulario/InterruptorAdopcion";

/** Comuna, especie, "Solo refugios" y orden. */
export const FiltrosSolidaria = ({ filtros, comunas, onCambiar }: FiltrosSolidariaProps) => (
  <div className="ap-filtros">
    <select className="ap-select" value={filtros.comuna ?? ""} onChange={(e) => onCambiar({ comuna: e.target.value || null })} aria-label={T.comuna}>
      <option value="">{T.todasComunas}</option>
      {comunas.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
    <select
      className="ap-select"
      value={filtros.especie ?? ""}
      onChange={(e) => onCambiar({ especie: (e.target.value || null) as EspecieAdopcion | null })}
      aria-label={T.especie}
    >
      <option value="">{T.todasEspecies}</option>
      {OPCIONES_ESPECIE_ADOPCION.filter((o) => o.valor !== "todos").map((o) => (
        <option key={o.valor} value={o.valor}>
          {o.label}
        </option>
      ))}
    </select>
    <InterruptorAdopcion etiqueta={T.soloRefugios} activo={filtros.soloRefugios} onCambiar={(soloRefugios) => onCambiar({ soloRefugios })} />
    <select className="ap-select" value={filtros.orden} onChange={(e) => onCambiar({ orden: e.target.value as OrdenSolidaria })} aria-label="Orden">
      {(Object.keys(T.orden) as OrdenSolidaria[]).map((o) => (
        <option key={o} value={o}>
          {T.orden[o]}
        </option>
      ))}
    </select>
  </div>
);
