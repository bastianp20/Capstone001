import { Cat, Dog, Heart } from "lucide-react";
import { TEXTOS_POSTULACION as T } from "../../../constants";
import type { PostulacionEnviadaAdopcionProps } from "../../../interfaces";

/** "¡Postulación enviada!" con una pequeña ilustración hecha de íconos. */
export const PostulacionEnviadaAdopcion = ({ publicador, onVerMas }: PostulacionEnviadaAdopcionProps) => (
  <div className="postula-enviada" role="status">
    <h2>{T.enviadaTitulo}</h2>
    <div className="postula-ilustracion" aria-hidden>
      <span className="postula-ilustracion-gato"><Cat size={44} strokeWidth={1.6} /></span>
      <span className="postula-ilustracion-corazon"><Heart size={34} fill="currentColor" /></span>
      <span className="postula-ilustracion-perro"><Dog size={60} strokeWidth={1.5} /></span>
    </div>
    <p>{T.enviadaTexto(publicador)}</p>
    <button type="button" className="adopta-btn adopta-btn-primario" onClick={onVerMas}>
      {T.verMas}
    </button>
  </div>
);
