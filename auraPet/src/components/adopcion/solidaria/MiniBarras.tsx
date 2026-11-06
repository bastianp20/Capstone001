import type { MiniBarrasProps } from "../../../interfaces";
import { mesAbreviado } from "../../../lib/fechas";

/** Barritas por mes (últimos 6) para "Tu impacto". */
export const MiniBarras = ({ datos }: MiniBarrasProps) => {
  const maximo = Math.max(1, ...datos.map((d) => d.total));
  return (
    <div className="ap-barras" role="img" aria-label={datos.map((d) => `${d.mes}: ${d.total}`).join(", ")}>
      {datos.map((d) => (
        <div key={d.mes} className="ap-barra">
          <span style={{ height: `${Math.max(6, (d.total / maximo) * 100)}%` }} className={d.total ? "" : "ap-barra-vacia"} />
          <small>{mesAbreviado(d.mes)}</small>
        </div>
      ))}
    </div>
  );
};
