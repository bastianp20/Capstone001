import { X } from "lucide-react";
import { useId } from "react";
import { useTeclaEscape } from "../../../hooks/useTeclaEscape";
import type { PanelLateralAdopcionProps } from "../../../interfaces";

/** Panel que entra por la derecha sobre la pantalla oscurecida (cerrar adopción, registrar atención…). */
export const PanelLateralAdopcion = ({ titulo, onCerrar, children, pie, ancho = "mediano" }: PanelLateralAdopcionProps) => {
  const idTitulo = useId();
  useTeclaEscape(onCerrar);
  return (
    <div className="ap-lateral-fondo" onClick={onCerrar}>
      <aside
        className={`ap-lateral ap-lateral-${ancho}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ap-lateral-cabecera">
          <h2 id={idTitulo}>{titulo}</h2>
          <button type="button" className="ap-icono-btn" onClick={onCerrar} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>
        <div className="ap-lateral-cuerpo">{children}</div>
        {pie && <footer className="ap-lateral-pie">{pie}</footer>}
      </aside>
    </div>
  );
};
