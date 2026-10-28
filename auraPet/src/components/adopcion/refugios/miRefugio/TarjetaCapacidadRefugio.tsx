import { Minus, Plus } from "lucide-react";
import { TEXTOS_MI_REFUGIO as T } from "../../../../constants";
import type { TarjetaCapacidadRefugioProps } from "../../../../interfaces";
import { haceCuanto } from "../../../../lib/publicacionesAdopcion";
import { porcentajeOcupacion } from "../../../../lib/refugios";
import { AnilloProgreso } from "../../comun/AnilloProgreso";

/** Anillo grande de cupos y botones − / + para actualizarlos al instante. */
export const TarjetaCapacidadRefugio = ({ ocupados, totales, actualizadoEn, onCambiar }: TarjetaCapacidadRefugioProps) => {
  const libres = Math.max(0, totales - ocupados);
  return (
    <section className="ap-tarjeta mr-capacidad">
      <h2>{T.capacidad}</h2>
      <div className="mr-capacidad-cuerpo">
        <div className="mr-anillo">
          <AnilloProgreso porcentaje={porcentajeOcupacion(ocupados, totales)} tamano={150} grosor={14} etiqueta="" />
          <span className="mr-anillo-texto">
            <strong>
              {ocupados} <small>/ {totales}</small>
            </strong>
            <small>{T.cuposOcupados}</small>
          </span>
        </div>
        <div className="mr-capacidad-lado">
          <p className="mr-libres" aria-live="polite">
            <strong>{libres}</strong> {T.cuposLibres(libres)}
          </p>
          <div className="mr-botones-cupos">
            <button type="button" className="mr-btn-cupo" onClick={() => onCambiar(ocupados - 1)} disabled={ocupados <= 0} aria-label={T.restar}>
              <Minus size={22} />
            </button>
            <button type="button" className="mr-btn-cupo mr-btn-cupo-mas" onClick={() => onCambiar(ocupados + 1)} disabled={ocupados >= totales} aria-label={T.sumar}>
              <Plus size={22} />
            </button>
          </div>
          <small className="ap-suave">{T.actualizado(haceCuanto(actualizadoEn))}</small>
        </div>
      </div>
    </section>
  );
};
