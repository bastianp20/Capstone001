import { PawPrint } from "lucide-react";
import { TEXTOS_PUBLICAR as T } from "../../../constants";
import type { InvitacionSesionAdopcionProps } from "../../../interfaces";

/** Sin sesión: invita a ingresar para poder publicar. */
export const InvitacionSesionAdopcion = ({ onIngresar }: InvitacionSesionAdopcionProps) => (
  <div className="publica-tarjeta publica-centrado">
    <PawPrint size={40} className="publica-icono-grande" aria-hidden />
    <h2>{T.sesionTitulo}</h2>
    <p>{T.sesionTexto}</p>
    <button type="button" className="adopta-btn adopta-btn-primario" onClick={onIngresar}>
      {T.ingresar}
    </button>
  </div>
);
