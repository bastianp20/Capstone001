import { SlidersHorizontal } from "lucide-react";
import { OPCIONES_ESPECIE_ADOPCION, TEXTOS_ADOPCION as T } from "../../constants";
import type { FiltrosAdopcionProps } from "../../interfaces";
import { InterruptorAdopcion } from "./formulario/InterruptorAdopcion";

/** Fila de filtros: especie en píldoras, "Solo revisados" y el botón del panel lateral. */
export const FiltrosAdopcion = ({ especie, onEspecie, soloRevisados, onSoloRevisados, filtrosActivos, onMasFiltros }: FiltrosAdopcionProps) => (
  <div className="adopta-filtros">
    <div className="adopta-filtros-especies" role="group" aria-label="Especie">
      {OPCIONES_ESPECIE_ADOPCION.map(({ valor, label, icono: Icono }) => (
        <button
          key={valor}
          type="button"
          className={`adopta-pildora ${especie === valor ? "adopta-pildora-activa" : ""}`}
          aria-pressed={especie === valor}
          onClick={() => onEspecie(valor)}
        >
          <Icono size={16} aria-hidden /> {label}
        </button>
      ))}
    </div>
    <div className="adopta-filtros-derecha">
      <InterruptorAdopcion etiqueta={T.soloRevisados} activo={soloRevisados} onCambiar={onSoloRevisados} />
      <button type="button" className="adopta-pildora adopta-pildora-borde" onClick={onMasFiltros}>
        <SlidersHorizontal size={15} aria-hidden /> {T.masFiltros}
        {filtrosActivos > 0 && <span className="adopta-contador">{filtrosActivos}</span>}
      </button>
    </div>
  </div>
);
