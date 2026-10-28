import { Check } from "lucide-react";
import { HITOS_CAMINO_CASA, TEXTOS_MIS_PUBLICACIONES as T } from "../../../constants";
import type { CaminoCasaProps } from "../../../interfaces";
import { hitoActual, hitosCumplidos } from "../../../lib/publicacionesAdopcion";

const ORDEN = HITOS_CAMINO_CASA.map((h) => h.hito);

/** "Camino a casa": 5 hitos (Publicado → Adoptado). Compacto = solo los puntos. */
export const CaminoCasa = ({ publicacion, compacto = false }: CaminoCasaProps) => {
  const hechos = hitosCumplidos(publicacion);
  const actual = hitoActual(publicacion, ORDEN);
  const avance = ((hechos.size - 1) / (ORDEN.length - 1)) * 100;

  return (
    <div className={`ap-camino ${compacto ? "ap-camino-compacto" : ""}`} aria-label={T.caminoCasa}>
      {!compacto && <span className="ap-camino-titulo">{T.caminoCasa}</span>}
      <ol>
        <span className="ap-camino-linea" aria-hidden>
          <span style={{ width: `${avance}%` }} />
        </span>
        {HITOS_CAMINO_CASA.map(({ hito, label }) => {
          const estado = hechos.has(hito) ? "hecho" : hito === actual ? "actual" : "pendiente";
          return (
            <li key={hito} className={`ap-hito ap-hito-${estado}`} title={label}>
              <span className="ap-hito-punto">{estado === "hecho" && <Check size={compacto ? 9 : 11} strokeWidth={3} aria-hidden />}</span>
              {!compacto && <span className="ap-hito-texto">{label}</span>}
              <span className="ap-solo-lector">{estado === "hecho" ? "(listo)" : estado === "actual" ? "(en curso)" : ""}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
