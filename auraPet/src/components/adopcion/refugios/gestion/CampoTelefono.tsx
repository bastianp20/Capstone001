import { TEXTOS_MODAL_REFUGIO as T } from "../../../../constants";
import type { CampoTelefonoProps } from "../../../../interfaces";

/** Celular con el +56 fijo adelante. */
export const CampoTelefono = ({ id, etiqueta, valor, onCambiar, error }: CampoTelefonoProps) => (
  <div className="adopta-campo">
    <label htmlFor={id}>{etiqueta}</label>
    <div className={`ap-telefono adopta-input ${error ? "adopta-input-error" : ""}`}>
      <span>{T.prefijo}</span>
      <input id={id} inputMode="tel" placeholder="9 1234 5678" value={valor} maxLength={12} onChange={(e) => onCambiar(e.target.value)} />
    </div>
    {error && <p className="adopta-campo-error">{error}</p>}
  </div>
);
