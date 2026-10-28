import { ArrowRight } from "lucide-react";
import { TEXTOS_REFUGIOS_ADMIN as T } from "../../../../constants";
import type { BandaKpisRefugiosProps } from "../../../../interfaces";

/** Cuatro números en una sola tarjeta dividida por líneas finas. */
export const BandaKpisRefugios = ({ kpis, onRevisar }: BandaKpisRefugiosProps) => (
  <section className="ra-kpis" aria-label={T.titulo}>
    <div className="ra-kpi">
      <span>{T.kpiVerificados}</span>
      <strong>{kpis.verificados}</strong>
    </div>
    <div className="ra-kpi">
      <span>{T.kpiPorRevisar}</span>
      <strong>{kpis.porRevisar}</strong>
      {kpis.porRevisar > 0 && (
        <button type="button" className="ra-kpi-enlace" onClick={onRevisar}>
          <span className="ra-punto-ambar" aria-hidden /> {T.revisar} <ArrowRight size={13} aria-hidden />
        </button>
      )}
    </div>
    <div className="ra-kpi">
      <span>{T.kpiAnimales}</span>
      <strong>{kpis.animales}</strong>
      <small>{T.enRefugios(kpis.verificados)}</small>
    </div>
    <div className="ra-kpi">
      <span>{T.kpiOcupacion}</span>
      <strong>{kpis.ocupacion}%</strong>
      <span className="ra-kpi-barra" aria-hidden>
        <span style={{ width: `${kpis.ocupacion}%` }} />
      </span>
    </div>
  </section>
);
