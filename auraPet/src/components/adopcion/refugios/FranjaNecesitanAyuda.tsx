import { AlertTriangle } from "lucide-react";
import { RECEPCION_REFUGIO_LABEL, TEXTOS_REFUGIOS as T } from "../../../constants";
import type { FranjaNecesitanAyudaProps } from "../../../interfaces";

/** Franja coral: refugios sin cupos o con cupos limitados. */
export const FranjaNecesitanAyuda = ({ refugios, onVer }: FranjaNecesitanAyudaProps) => {
  if (!refugios.length) return null;
  return (
    <section className="ap-ayuda">
      <h2>
        <AlertTriangle size={18} aria-hidden /> {T.necesitanAyuda}
      </h2>
      <div className="ap-ayuda-lista">
        {refugios.map((r) => (
          <button key={r.id} type="button" className="ap-ayuda-item" onClick={() => onVer(r)}>
            <small>{RECEPCION_REFUGIO_LABEL[r.recibe]}</small>
            <strong>{r.nombre}</strong>
          </button>
        ))}
      </div>
    </section>
  );
};
