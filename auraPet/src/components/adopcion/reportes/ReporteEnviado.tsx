import { Clock, Heart, Mail, Sparkles } from "lucide-react";
import { TEXTOS_REPORTE as T } from "../../../constants";
import type { ReporteEnviadoProps } from "../../../interfaces";

/** "¡Gracias por cuidar a…!" con el número del reporte. */
export const ReporteEnviado = ({ nombre, numero, onCerrar }: ReporteEnviadoProps) => (
  <div className="rep-gracias">
    <div className="rep-gracias-ilustracion" aria-hidden>
      <Sparkles size={18} className="rep-destello rep-destello-1" />
      <Sparkles size={14} className="rep-destello rep-destello-2" />
      <Mail size={64} strokeWidth={1.4} />
      <Heart size={22} className="rep-gracias-corazon" />
    </div>
    <h2>{T.graciasTitulo(nombre)}</h2>
    <p>{T.graciasTexto}</p>
    <span className="rep-numero">
      <Clock size={15} aria-hidden /> {T.numero(numero)}
    </span>
    <button type="button" className="rep-btn rep-btn-primario rep-btn-ancho" onClick={onCerrar} autoFocus>
      {T.volver}
    </button>
  </div>
);
