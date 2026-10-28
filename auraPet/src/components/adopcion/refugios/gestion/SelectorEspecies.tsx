import { ESPECIES_REFUGIO } from "../../../../constants";
import type { SelectorEspeciesProps } from "../../../../interfaces";

/** Chips grandes para elegir qué especies recibe el refugio. */
export const SelectorEspecies = ({ valor, onCambiar, error }: SelectorEspeciesProps) => (
  <div>
    <div className="ap-especies-chips" role="group">
      {ESPECIES_REFUGIO.map(({ valor: v, label, icono: Icono }) => {
        const activo = valor.includes(v);
        return (
          <button
            key={v}
            type="button"
            aria-pressed={activo}
            className={`ap-especie-chip ${activo ? "ap-especie-chip-activo" : ""}`}
            onClick={() => onCambiar(activo ? valor.filter((x) => x !== v) : [...valor, v])}
          >
            <Icono size={18} aria-hidden /> {label}
          </button>
        );
      })}
    </div>
    {error && <p className="adopta-campo-error">{error}</p>}
  </div>
);
