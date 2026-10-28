import { TEXTOS_REFUGIOS as T } from "../../../constants";
import type { FiltrosRefugiosProps } from "../../../interfaces";
import { InterruptorAdopcion } from "../formulario/InterruptorAdopcion";

/** Región, comuna, "Abiertos a recibir animales" y perros/gatos. */
export const FiltrosRefugios = ({ filtros, regiones, comunas, onCambiar }: FiltrosRefugiosProps) => (
  <div className="ap-filtros">
    <select className="ap-select" value={filtros.region ?? ""} onChange={(e) => onCambiar({ region: e.target.value || null, comuna: null })} aria-label={T.region}>
      <option value="">{T.todasRegiones}</option>
      {regiones.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
    <select className="ap-select" value={filtros.comuna ?? ""} onChange={(e) => onCambiar({ comuna: e.target.value || null })} aria-label={T.comuna}>
      <option value="">{T.todasComunas}</option>
      {comunas.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
    <InterruptorAdopcion etiqueta={T.soloAbiertos} activo={filtros.soloAbiertos} onCambiar={(soloAbiertos) => onCambiar({ soloAbiertos })} />
    <div className="adopta-grupo-opciones">
      {(["perro", "gato"] as const).map((e) => (
        <button
          key={e}
          type="button"
          className={`adopta-pildora ${filtros.especie === e ? "adopta-pildora-activa" : ""}`}
          aria-pressed={filtros.especie === e}
          onClick={() => onCambiar({ especie: filtros.especie === e ? null : e })}
        >
          {e === "perro" ? T.perros : T.gatos}
        </button>
      ))}
    </div>
  </div>
);
