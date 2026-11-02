import { ArrowRight, PawPrint } from "lucide-react";
import { TEXTOS_SUMATE as T } from "../../../../constants";
import type { CierreSumateProps } from "../../../../interfaces";

/** Banda final coral con el llamado a postular. */
export const CierreSumate = ({ onPostular }: CierreSumateProps) => (
  <section className="su-cierre">
    <PawPrint className="su-cierre-huella" size={160} aria-hidden />
    <div>
      <h2>{T.cierreTitulo}</h2>
      <p>{T.cierreTexto}</p>
    </div>
    <button type="button" className="ap-btn ap-btn-grande su-btn-blanco" onClick={onPostular}>
      {T.postular} <ArrowRight size={18} aria-hidden />
    </button>
  </section>
);
