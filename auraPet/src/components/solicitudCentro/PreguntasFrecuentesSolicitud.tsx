import { Iconos, TEXTOS_SOLICITUD } from "../../constants";
import type { PreguntasFrecuentesSolicitudProps } from "../../interfaces";

// Acordeón liviano con <details>: accesible y sin estado propio
export const PreguntasFrecuentesSolicitud = ({ preguntas }: PreguntasFrecuentesSolicitudProps) => (
  <section className="solicitud-faq" aria-labelledby="solicitud-faq-titulo">
    <h2 id="solicitud-faq-titulo" className="solicitud-faq-titulo">{TEXTOS_SOLICITUD.tituloPreguntas}</h2>
    {preguntas.map((p) => (
      <details key={p.pregunta} className="solicitud-faq-item">
        <summary>
          {p.pregunta}
          <Iconos.flechaAbajo size={18} className="solicitud-faq-flecha" aria-hidden="true" />
        </summary>
        <p>{p.respuesta}</p>
      </details>
    ))}
  </section>
);
