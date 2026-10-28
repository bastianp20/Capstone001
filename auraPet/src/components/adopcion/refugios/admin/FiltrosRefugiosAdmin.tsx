import { Search } from "lucide-react";
import { FILTROS_ESTADO_REFUGIO, TEXTOS_REFUGIOS_ADMIN as T } from "../../../../constants";
import type { FiltrosRefugiosAdminProps } from "../../../../interfaces";
import { InterruptorAdopcion } from "../../formulario/InterruptorAdopcion";

/** Buscador, estado (píldora segmentada), región e "Incluir de prueba". */
export const FiltrosRefugiosAdmin = ({ filtros, regiones, onCambiar }: FiltrosRefugiosAdminProps) => (
  <div className="ra-filtros">
    <label className="ap-buscador ra-buscador">
      <Search size={17} aria-hidden />
      <span className="ap-solo-lector">{T.buscar}</span>
      <input type="search" placeholder={T.buscar} value={filtros.texto} onChange={(e) => onCambiar({ texto: e.target.value })} />
    </label>
    <div className="ra-pildora" role="radiogroup" aria-label={T.kpiPorRevisar}>
      {FILTROS_ESTADO_REFUGIO.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={filtros.estado === o.valor}
          className={`ra-pildora-opcion ra-pildora-${o.valor} ${filtros.estado === o.valor ? "ra-pildora-activa" : ""}`}
          onClick={() => onCambiar({ estado: o.valor })}
        >
          {o.label}
        </button>
      ))}
    </div>
    <select className="ap-select" value={filtros.region ?? ""} onChange={(e) => onCambiar({ region: e.target.value || null })} aria-label={T.region}>
      <option value="">{T.todasRegiones}</option>
      {regiones.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
    <InterruptorAdopcion etiqueta={T.incluirPrueba} activo={filtros.incluirPrueba} onCambiar={(v) => onCambiar({ incluirPrueba: v })} />
  </div>
);
