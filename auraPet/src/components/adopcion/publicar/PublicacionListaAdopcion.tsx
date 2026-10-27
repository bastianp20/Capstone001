import { PartyPopper } from "lucide-react";
import { TEXTOS_PUBLICAR as T } from "../../../constants";
import type { PublicacionListaAdopcionProps } from "../../../interfaces";

/** Después de publicar: ver la ficha o publicar otro animal. */
export const PublicacionListaAdopcion = ({ nombre, onVer, onOtra }: PublicacionListaAdopcionProps) => (
  <div className="publica-centrado" role="status">
    <PartyPopper size={44} className="publica-icono-grande" aria-hidden />
    <h2>{T.listoTitulo(nombre)}</h2>
    <p>{T.listoTexto}</p>
    <div className="publica-botones">
      <button type="button" className="adopta-btn adopta-btn-borde" onClick={onOtra}>
        {T.otra}
      </button>
      <button type="button" className="adopta-btn adopta-btn-primario" onClick={onVer}>
        {T.verPublicacion}
      </button>
    </div>
  </div>
);
