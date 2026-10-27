import { TEXTOS_ADOPCION as T } from "../../constants";
import type { HeroAdopcionProps } from "../../interfaces";
import { MosaicoHeroAdopcion } from "./MosaicoHeroAdopcion";

/** Portada de /adopta: título, botones, números y el mosaico de fotos. */
export const HeroAdopcion = ({ estadisticas, fotos, etiquetaFlotante, onConocerlos, onDarEnAdopcion }: HeroAdopcionProps) => (
  <section className="adopta-hero-fondo">
    <div className="adopta-hero">
      <div className="adopta-hero-texto">
        <h1>{T.titulo}</h1>
        <p className="adopta-hero-bajada">{T.bajada}</p>
        <div className="adopta-hero-botones">
          <button type="button" className="adopta-btn adopta-btn-primario" onClick={onConocerlos}>
            {T.conocerlos}
          </button>
          <button type="button" className="adopta-btn adopta-btn-borde" onClick={onDarEnAdopcion}>
            {T.darEnAdopcion}
          </button>
        </div>
        <p className="adopta-hero-numeros">
          <strong>{estadisticas.esperando}</strong> {T.esperando} · <strong>{estadisticas.revisados}</strong> {T.revisados} ·{" "}
          <strong>{estadisticas.conFamilia}</strong> {T.conFamilia}
        </p>
      </div>
      <MosaicoHeroAdopcion fotos={fotos} etiqueta={etiquetaFlotante} />
    </div>
  </section>
);
