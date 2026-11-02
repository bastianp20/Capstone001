import { ICONO_MODERACION as Icono, TEXTOS_AVISO_MODERACION as T } from "../../../constants";
import type { AvisoModeracionPublicacionProps } from "../../../interfaces";
import "../../../css/Moderacion.css";

/** Lo que el equipo AuraPet le dice a quien publicó (oculta o advertencia). */
export const AvisoModeracionPublicacion = ({ aviso }: AvisoModeracionPublicacionProps) => (
  <div className={`mod-aviso mod-aviso-${aviso.tipo}`} role="note">
    <Icono size={16} aria-hidden />
    <span>
      <strong>{T[aviso.tipo]}</strong>
      {aviso.mensaje}
    </span>
  </div>
);
