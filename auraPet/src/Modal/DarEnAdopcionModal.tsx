import { X } from "lucide-react";
import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { FormularioPublicarAdopcion } from "../components/adopcion/publicar/FormularioPublicarAdopcion";
import { rutaFichaAdopcion, TEXTOS_DAR_EN_ADOPCION_PANEL as T } from "../constants";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import type { DarEnAdopcionModalProps } from "../interfaces";
import "../css/AdopcionCompartido.css";
import "../css/PublicarAdopcionPage.css";

// "Dar en adopción" desde el panel de cualquier rol (dueño, veterinario, centro o
// superadmin): el mismo formulario de /adopta/publicar, en un modal.
export const DarEnAdopcionModal = ({ onCerrar, onPublicada, refugioId }: DarEnAdopcionModalProps) => {
  const idTitulo = useId();
  const navigate = useNavigate();
  useTeclaEscape(onCerrar);

  return (
    <div className="adopta adopta-modal-fondo" onClick={onCerrar}>
      <div className="adopta-modal adopta-modal-ancho" role="dialog" aria-modal="true" aria-labelledby={idTitulo} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="adopta-icono-btn adopta-modal-cerrar" onClick={onCerrar} aria-label={T.cerrar}>
          <X size={18} />
        </button>
        <header className="adopta-modal-cabecera">
          <h2 id={idTitulo}>{T.titulo}</h2>
          <p>{T.subtitulo}</p>
        </header>
        <div className="adopta-modal-cuerpo">
          <FormularioPublicarAdopcion enModal refugioId={refugioId} onPublicada={onPublicada} onVerPublicacion={(id) => navigate(rutaFichaAdopcion(id))} />
        </div>
      </div>
    </div>
  );
};
