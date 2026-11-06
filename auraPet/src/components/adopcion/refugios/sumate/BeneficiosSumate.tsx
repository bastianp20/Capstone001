import { BENEFICIOS_SUMATE, TEXTOS_SUMATE as T } from "../../../../constants";

/** Bento de beneficios: la primera tarjeta es grande, el resto en grilla. */
export const BeneficiosSumate = () => (
  <section className="su-seccion">
    <h2>{T.beneficiosTitulo}</h2>
    <div className="su-bento">
      {BENEFICIOS_SUMATE.map(({ icono: Icono, titulo, texto }, i) => (
        <article key={titulo} className={`su-beneficio su-beneficio-${i}`}>
          <span className="su-beneficio-icono" aria-hidden>
            <Icono size={i === 0 ? 30 : 22} />
          </span>
          <h3>{titulo}</h3>
          <p>{texto}</p>
        </article>
      ))}
    </div>
  </section>
);
