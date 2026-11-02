import { Clock, House, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RUTA_PANEL, TEXTOS_POSTULAR_REFUGIO as T } from "../../../../constants";
import type { PostulacionEnviadaProps } from "../../../../interfaces";

/** Pantalla final: la postulación llegó y queda en revisión. */
export const PostulacionEnviada = ({ nombre, correoAcceso, onVolver }: PostulacionEnviadaProps) => {
  const navigate = useNavigate();
  return (
    <section className="pr-enviada" aria-live="polite">
      <span className="pr-enviada-icono" aria-hidden>
        <PartyPopper size={40} />
      </span>
      <h2>{T.enviadaTitulo(nombre)}</h2>
      <p>{correoAcceso ? T.enviadaTextoSinCuenta(correoAcceso) : T.enviadaTexto}</p>
      <span className="pr-enviada-pildora">
        <Clock size={15} aria-hidden /> {T.enRevision}
      </span>
      <div className="pr-enviada-botones">
        {!correoAcceso && (
          <button type="button" className="ap-btn ap-btn-primario" onClick={() => navigate(RUTA_PANEL)}>
            <House size={16} aria-hidden /> {T.irAlPanel}
          </button>
        )}
        <button type="button" className={`ap-btn ${correoAcceso ? "ap-btn-primario" : "ap-btn-borde"}`} onClick={onVolver}>
          {T.verRefugios}
        </button>
      </div>
    </section>
  );
};
