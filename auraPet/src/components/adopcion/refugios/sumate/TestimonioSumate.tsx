import { Quote } from "lucide-react";
import { TEXTOS_SUMATE as T, TONOS_ADOPCION } from "../../../../constants";
import type { TestimonioSumateProps } from "../../../../interfaces";
import { AvatarAnimal } from "../../AvatarAnimal";

/** Una historia real de adopción (se oculta si todavía no hay). */
export const TestimonioSumate = ({ historia: h }: TestimonioSumateProps) => (
  <section className="su-seccion">
    <h2>{T.testimonioTitulo}</h2>
    <figure className="su-testimonio">
      <AvatarAnimal especie={h.especie} fotoUrl={h.fotoUrl} nombre={h.nombre} tono={TONOS_ADOPCION[2]} tamanoIcono={56} className="su-testimonio-foto" />
      <blockquote>
        <Quote size={30} aria-hidden />
        <p>{h.frase}</p>
        <figcaption>
          <strong>{h.nombre}</strong>
          {h.adoptante && <span> · {h.adoptante}</span>}
        </figcaption>
      </blockquote>
    </figure>
  </section>
);
