import { TEXTOS_MODAL_REFUGIO as T } from "../../../../constants";
import type { VistaPreviaRefugioProps } from "../../../../interfaces";
import { refugioDeVistaPrevia } from "../../../../lib/refugios";
import { TarjetaRefugio } from "../TarjetaRefugio";

/** La tarjeta pública del refugio, armada en vivo con lo que se va escribiendo. */
export const VistaPreviaRefugio = ({ datos }: VistaPreviaRefugioProps) => (
  <aside className="ra-vista-previa" aria-label={T.vistaPrevia}>
    <span className="ra-vista-etiqueta">
      <span className="ra-punto-verde" aria-hidden /> {T.vistaPrevia}
    </span>
    <div className="ra-vista-tarjeta" inert>
      <TarjetaRefugio refugio={refugioDeVistaPrevia(datos, { nombre: T.nombreEjemplo, comuna: T.comunaEjemplo })} onVerAnimales={() => undefined} />
    </div>
    <small className="ap-suave">{T.asiSeVera}</small>
  </aside>
);
