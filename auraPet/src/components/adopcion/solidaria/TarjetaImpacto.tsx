import { TEXTOS_SOLIDARIA as T } from "../../../constants";
import type { TarjetaImpactoProps } from "../../../interfaces";
import { MiniBarras } from "./MiniBarras";

/** "Tu impacto": cuántos atendió gratis, cuántos ya tienen familia y su actividad por mes. */
export const TarjetaImpacto = ({ resumen }: TarjetaImpactoProps) => (
  <section className="ap-impacto ap-tono-durazno">
    <div>
      <span className="ap-etiqueta-suave">{T.impacto}</span>
      <strong className="ap-impacto-numero">{T.atendidosGratis(resumen.solidarias)}</strong>
      <p>{T.adoptados(resumen.adoptados)}</p>
      <small className="ap-suave">{T.atencionesTotales(resumen.atenciones)}</small>
    </div>
    <MiniBarras datos={resumen.porMes} />
  </section>
);
