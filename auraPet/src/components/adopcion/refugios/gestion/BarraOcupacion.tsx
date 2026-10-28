import { TEXTOS_MODAL_REFUGIO as T } from "../../../../constants";
import type { BarraOcupacionProps } from "../../../../interfaces";
import { porcentajeOcupacion } from "../../../../lib/refugios";

/** Barra ancha "76% ocupado · 12 cupos libres". */
export const BarraOcupacion = ({ ocupados, totales }: BarraOcupacionProps) => {
  const porcentaje = porcentajeOcupacion(ocupados, totales);
  const tono = porcentaje >= 100 ? "lleno" : porcentaje >= 85 ? "alto" : "ok";
  return (
    <div className="ap-ocupacion">
      <span className="ap-ocupacion-riel" aria-hidden>
        <span className={`ap-ocupacion-${tono}`} style={{ width: `${porcentaje}%` }} />
      </span>
      <small>{T.ocupacion(porcentaje, Math.max(0, totales - ocupados))}</small>
    </div>
  );
};
