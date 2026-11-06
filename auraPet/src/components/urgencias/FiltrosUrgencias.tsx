import { TEXTOS_URGENCIAS as T } from "../../constants";
import type { FiltrosUrgenciasProps } from "../../interfaces";

// Comuna, "solo abiertos" y "solo con UCI disponible".
export const FiltrosUrgencias = ({ comunas, filtros, onCambiar }: FiltrosUrgenciasProps) => (
  <div className="urg-filtros" role="group" aria-label="Filtros">
    <label>
      {T.comuna}
      <select value={filtros.comuna} onChange={(e) => onCambiar({ comuna: e.target.value })}>
        <option value="">{T.todasLasComunas}</option>
        {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </label>
    <label>
      <input type="checkbox" checked={filtros.soloAbiertos} onChange={(e) => onCambiar({ soloAbiertos: e.target.checked })} />
      {T.soloAbiertos}
    </label>
    <label>
      <input type="checkbox" checked={filtros.soloUciDisponible} onChange={(e) => onCambiar({ soloUciDisponible: e.target.checked })} />
      {T.soloUci}
    </label>
  </div>
);
