import { PASOS_SUMATE, TEXTOS_SUMATE as T } from "../../../../constants";

/** Los 3 pasos (postula · revisamos · publica) unidos por una línea. */
export const PasosSumate = () => (
  <section className="su-seccion">
    <h2>{T.pasosTitulo}</h2>
    <ol className="su-pasos">
      {PASOS_SUMATE.map(({ icono: Icono, titulo, texto }, i) => (
        <li key={titulo}>
          <span className="su-paso-icono" aria-hidden>
            <Icono size={24} />
            <b>{i + 1}</b>
          </span>
          <h3>{titulo}</h3>
          <p>{texto}</p>
        </li>
      ))}
    </ol>
  </section>
);
