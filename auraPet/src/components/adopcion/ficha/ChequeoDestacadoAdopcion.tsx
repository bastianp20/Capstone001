import { Clock, Stethoscope } from "lucide-react";
import { TEXTOS_ADOPCION, TEXTOS_FICHA_ADOPCION as T } from "../../../constants";
import type { ChequeoDestacadoAdopcionProps } from "../../../interfaces";
import { formatFechaLarga } from "../../../lib/fechas";

/** Bloque destacado del último chequeo; si aún no hay, avisa que se pidió revisión. */
export const ChequeoDestacadoAdopcion = ({ chequeo, solicitado }: ChequeoDestacadoAdopcionProps) => {
  if (!chequeo) {
    if (!solicitado) return null;
    return (
      <section className="ficha-chequeo ficha-chequeo-pendiente">
        <Clock size={26} aria-hidden />
        <div>
          <strong>{T.chequeoSolicitado}</strong>
          <p>{T.chequeoSolicitadoDetalle}</p>
        </div>
      </section>
    );
  }
  return (
    <section className="ficha-chequeo">
      <Stethoscope size={26} aria-hidden />
      <div>
        <p className="ficha-chequeo-titulo">
          {T.chequeoTitulo(chequeo.fecha ? formatFechaLarga(chequeo.fecha) : "", chequeo.veterinario, chequeo.centro)}
        </p>
        <strong>{chequeo.resumen}</strong>
        {chequeo.solidario && <span className="ficha-chequeo-solidario">{TEXTOS_ADOPCION.solidario}</span>}
      </div>
    </section>
  );
};
