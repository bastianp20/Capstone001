import { PESTANAS_MODERACION, TEXTOS_MODERACION as T } from "../../../constants";
import type { EncabezadoModeracionProps } from "../../../interfaces";

/** Título, métricas en una línea y el control Por revisar · Resueltos · Descartados. */
export const EncabezadoModeracion = ({ resumen, estado, onEstado }: EncabezadoModeracionProps) => (
  <header className="mod-encabezado">
    <div>
      <h1>{T.titulo}</h1>
      <p>
        <strong>{T.porRevisar(resumen.porRevisar)}</strong>
        <span aria-hidden> · </span>
        <span className={resumen.urgentes ? "mod-urgentes" : ""}>{T.urgentes(resumen.urgentes)}</span>
        <span aria-hidden> · </span>
        {T.respuesta(resumen.horasRespuesta)}
        <span aria-hidden> · </span>
        {T.ocultas(resumen.ocultas)}
      </p>
    </div>
    <div className="mod-segmentado" role="tablist" aria-label={T.titulo}>
      {PESTANAS_MODERACION.map((p) => (
        <button
          key={p.valor}
          type="button"
          role="tab"
          aria-selected={estado === p.valor}
          className={estado === p.valor ? "mod-segmento-activo" : ""}
          onClick={() => onEstado(p.valor)}
        >
          {p.label}
          {p.valor === "pendiente" && resumen.porRevisar > 0 && <span className="mod-contador">{resumen.porRevisar}</span>}
        </button>
      ))}
    </div>
  </header>
);
