import { GIROS_POLAROID, TEXTOS_ADOPCION as T, TONOS_ADOPCION } from "../../constants";
import type { HistoriasExitoProps } from "../../interfaces";
import { PolaroidHistoria } from "./PolaroidHistoria";

/** "Ya tienen familia": las adopciones que se concretaron. */
export const HistoriasExito = ({ historias }: HistoriasExitoProps) => {
  if (!historias.length) return null;
  return (
    <section className="adopta-historias">
      <h2 className="adopta-subtitulo">{T.historiasTitulo}</h2>
      <div className="adopta-historias-fila">
        {historias.map((h, i) => (
          <PolaroidHistoria key={h.id} historia={h} giro={GIROS_POLAROID[i % GIROS_POLAROID.length]} tono={TONOS_ADOPCION[(i + 1) % TONOS_ADOPCION.length]} />
        ))}
      </div>
    </section>
  );
};
