import { Plus } from "lucide-react";
import { TEXTOS_MIS_PUBLICACIONES as T } from "../../../constants";
import type { EncabezadoMisPublicacionesProps } from "../../../interfaces";

/** Título grande, botón "Dar en adopción" y los 3 números sobre fondos pastel. */
export const EncabezadoMisPublicaciones = ({ publicados, nuevas, adoptados, onDarEnAdopcion }: EncabezadoMisPublicacionesProps) => (
  <header className="ap-encabezado">
    <div className="ap-encabezado-texto">
      <h1>{T.titulo}</h1>
      <p>{T.bajada}</p>
      <button type="button" className="ap-btn ap-btn-primario" onClick={onDarEnAdopcion}>
        {T.darEnAdopcion} <Plus size={16} aria-hidden />
      </button>
    </div>
    <div className="ap-numeros">
      <div className="ap-numero ap-tono-lavanda">
        <strong>{publicados}</strong>
        <span>{T.publicados}</span>
      </div>
      <div className="ap-numero ap-tono-durazno">
        {nuevas > 0 && <span className="ap-punto-vivo" aria-hidden />}
        <strong>{nuevas}</strong>
        <span>{T.nuevas}</span>
      </div>
      <div className="ap-numero ap-tono-crema">
        <strong>{adoptados}</strong>
        <span>{T.conFamilia}</span>
      </div>
    </div>
  </header>
);
