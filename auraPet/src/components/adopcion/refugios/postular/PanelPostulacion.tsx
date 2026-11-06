import { PASOS_POSTULAR_REFUGIO, TEXTOS_POSTULAR_REFUGIO as T } from "../../../../constants";
import type { PanelPostulacionProps } from "../../../../interfaces";
import { refugioDePostulacion } from "../../../../lib/refugios";
import { StepperVertical } from "../../comun/StepperVertical";
import { TarjetaRefugio } from "../TarjetaRefugio";

/** Panel verde de la izquierda: los pasos y la tarjeta pública armándose en vivo. */
export const PanelPostulacion = ({ datos, paso }: PanelPostulacionProps) => (
  <aside className="pr-panel">
    <div className="pr-panel-cabecera">
      <h1>{T.panelTitulo}</h1>
      <p>{T.panelBajada}</p>
    </div>
    <StepperVertical pasos={PASOS_POSTULAR_REFUGIO} actual={paso} />
    <div className="pr-vista">
      <span className="pr-vista-etiqueta">
        <span className="pr-punto" aria-hidden /> {T.vistaPrevia}
      </span>
      <div className="pr-vista-tarjeta" inert>
        <TarjetaRefugio refugio={refugioDePostulacion(datos)} onVerAnimales={() => undefined} />
      </div>
    </div>
  </aside>
);
