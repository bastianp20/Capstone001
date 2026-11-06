import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { useId } from "react";
import { TEXTOS_RECORTE as T, ZOOM_RECORTE } from "../../constants";
import { useAccion } from "../../hooks/useAccion";
import { useRecortador } from "../../hooks/useRecortador";
import { useTeclaEscape } from "../../hooks/useTeclaEscape";
import type { ModalRecorteImagenProps } from "../../interfaces";
import "../../css/RecorteImagen.css";

/** Ajustar una foto antes de subirla: arrastrar para encuadrar y zoom. */
export const ModalRecorteImagen = ({ url, formato, titulo, onListo, onCancelar }: ModalRecorteImagenProps) => {
  const idTitulo = useId();
  const { marco, cargada, zoom, setZoom, estiloImagen, eventos, restablecer, exportar } = useRecortador(url, formato);
  const { ejecutar, ocupado, error } = useAccion();
  useTeclaEscape(onCancelar, !ocupado);
  const cambiarZoom = (z: number) => setZoom(Math.max(ZOOM_RECORTE.minimo, Math.min(ZOOM_RECORTE.maximo, z)));

  const usar = () =>
    ejecutar(async () => {
      onListo(await exportar());
    }, T.procesando);

  return (
    <div className="recorte-fondo" onClick={() => !ocupado && onCancelar()}>
      <div className="recorte-modal" role="dialog" aria-modal="true" aria-labelledby={idTitulo} onClick={(e) => e.stopPropagation()}>
        <header className="recorte-cabecera">
          <div>
            <h2 id={idTitulo}>{titulo}</h2>
            <p>{T.ayuda}</p>
          </div>
          <button type="button" className="recorte-icono" onClick={onCancelar} aria-label={T.cancelar} disabled={ocupado}>
            <X size={18} />
          </button>
        </header>

        <div className="recorte-escenario">
          <div
            ref={marco}
            className={`recorte-marco recorte-marco-${formato.forma}`}
            style={{ aspectRatio: String(formato.aspecto) }}
            {...eventos}
          >
            {cargada && <img src={url} alt="" draggable={false} style={estiloImagen} />}
          </div>
        </div>

        <div className="recorte-controles">
          <button type="button" className="recorte-icono" onClick={() => cambiarZoom(zoom - 0.2)} aria-label={T.alejar}>
            <Minus size={16} />
          </button>
          <input
            type="range"
            aria-label={T.zoom}
            min={ZOOM_RECORTE.minimo}
            max={ZOOM_RECORTE.maximo}
            step={ZOOM_RECORTE.paso}
            value={zoom}
            onChange={(e) => cambiarZoom(Number(e.target.value))}
          />
          <button type="button" className="recorte-icono" onClick={() => cambiarZoom(zoom + 0.2)} aria-label={T.acercar}>
            <Plus size={16} />
          </button>
          <button type="button" className="recorte-restablecer" onClick={restablecer}>
            <RotateCcw size={14} aria-hidden /> {T.restablecer}
          </button>
        </div>

        {error && <p className="recorte-error" role="alert">{error}</p>}
        <footer className="recorte-pie">
          <button type="button" className="recorte-btn recorte-btn-borde" onClick={onCancelar} disabled={ocupado}>
            {T.cancelar}
          </button>
          <button type="button" className="recorte-btn recorte-btn-primario" onClick={usar} disabled={ocupado || !cargada}>
            {ocupado ? T.procesando : T.usar}
          </button>
        </footer>
      </div>
    </div>
  );
};
