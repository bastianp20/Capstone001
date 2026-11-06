import { ArrowRight, BadgeCheck, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { FOTOS_HERO_ADOPCION, RUTA_REFUGIOS, TEXTOS_REFUGIOS as TR, TEXTOS_SUMATE as T } from "../../../../constants";
import type { HeroSumateProps } from "../../../../interfaces";

/** Hero de la landing: mensaje, botón de postular, números reales y la foto. */
export const HeroSumate = ({ resumen, onPostular }: HeroSumateProps) => {
  const foto = FOTOS_HERO_ADOPCION[1];
  return (
    <section className="su-hero">
      <div className="su-hero-texto">
        <span className="su-etiqueta">
          <HeartHandshake size={15} aria-hidden /> {T.etiqueta}
        </span>
        <h1>{T.titulo}</h1>
        <p>{T.bajada}</p>
        <div className="su-hero-botones">
          <button type="button" className="ap-btn ap-btn-grande su-btn-coral" onClick={onPostular}>
            {T.postular} <ArrowRight size={18} aria-hidden />
          </button>
          <Link to={RUTA_REFUGIOS} className="ap-btn ap-btn-grande ap-btn-borde">
            {T.verRefugios}
          </Link>
        </div>
        <small className="su-gratis">
          <BadgeCheck size={15} aria-hidden /> {T.gratis}
        </small>
      </div>
      <div className="su-hero-visual">
        <img src={foto.src} alt={foto.alt} />
        {resumen && (
          <dl className="su-hero-numeros">
            <div>
              <dt>{T.refugios(resumen.refugios)}</dt>
              <dd>{resumen.refugios}</dd>
            </div>
            <div>
              <dt>{T.animales}</dt>
              <dd>{resumen.animales}</dd>
            </div>
            <div>
              <dt>{TR.aliados}</dt>
              <dd>{resumen.aliados}</dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  );
};
