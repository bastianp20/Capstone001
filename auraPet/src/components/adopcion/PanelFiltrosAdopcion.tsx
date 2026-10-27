import { Search, X } from "lucide-react";
import {
  OPCIONES_ETAPA_ADOPCION,
  OPCIONES_SEXO_ADOPCION,
  OPCIONES_TAMANO_ADOPCION,
  TEXTOS_ADOPCION as T,
  TITULOS_FILTROS_ADOPCION,
} from "../../constants";
import { useTeclaEscape } from "../../hooks/useTeclaEscape";
import type { PanelFiltrosAdopcionProps } from "../../interfaces";
import { GrupoOpcionesAdopcion } from "./GrupoOpcionesAdopcion";

/** Panel lateral "Más filtros": buscador, tamaño, edad, sexo y comuna. */
export const PanelFiltrosAdopcion = ({ abierto, busqueda, onBusqueda, filtros, onCambiar, comunas, resultados, onLimpiar, onCerrar }: PanelFiltrosAdopcionProps) => {
  useTeclaEscape(onCerrar, abierto);
  if (!abierto) return null;

  return (
    <div className="adopta-panel-fondo" onClick={onCerrar}>
      <aside className="adopta-panel" role="dialog" aria-modal="true" aria-label={T.panelTitulo} onClick={(e) => e.stopPropagation()}>
        <header className="adopta-panel-cabecera">
          <h2>{T.panelTitulo}</h2>
          <button type="button" className="adopta-icono-btn" onClick={onCerrar} aria-label={T.cerrar}>
            <X size={18} />
          </button>
        </header>

        <div className="adopta-panel-cuerpo">
          <label className="adopta-buscador">
            <Search size={16} aria-hidden />
            <input type="search" value={busqueda} onChange={(e) => onBusqueda(e.target.value)} placeholder={T.buscar} aria-label={T.buscar} />
          </label>
          <GrupoOpcionesAdopcion titulo={TITULOS_FILTROS_ADOPCION.tamano} opciones={OPCIONES_TAMANO_ADOPCION} valor={filtros.tamano} onElegir={(tamano) => onCambiar({ tamano })} />
          <GrupoOpcionesAdopcion titulo={TITULOS_FILTROS_ADOPCION.etapa} opciones={OPCIONES_ETAPA_ADOPCION} valor={filtros.etapa} onElegir={(etapa) => onCambiar({ etapa })} />
          <GrupoOpcionesAdopcion titulo={TITULOS_FILTROS_ADOPCION.sexo} opciones={OPCIONES_SEXO_ADOPCION} valor={filtros.sexo} onElegir={(sexo) => onCambiar({ sexo })} />
          <label className="adopta-grupo">
            <span className="adopta-grupo-titulo">{T.comuna}</span>
            <select className="adopta-select" value={filtros.comuna ?? ""} onChange={(e) => onCambiar({ comuna: e.target.value || null })}>
              <option value="">{T.todasLasComunas}</option>
              {comunas.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <footer className="adopta-panel-pie">
          <button type="button" className="adopta-btn adopta-btn-borde" onClick={onLimpiar}>
            {T.limpiarFiltros}
          </button>
          <button type="button" className="adopta-btn adopta-btn-primario" onClick={onCerrar}>
            {T.verResultados(resultados)}
          </button>
        </footer>
      </aside>
    </div>
  );
};
