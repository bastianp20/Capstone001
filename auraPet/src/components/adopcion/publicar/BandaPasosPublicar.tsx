import { ArrowRight } from "lucide-react";
import { TEXTOS_PUBLICAR as T } from "../../../constants";
import type { BandaPasosPublicarProps } from "../../../interfaces";

/** Franja menta de "Dar en adopción" con los 3 pasos del proceso. */
export const BandaPasosPublicar = ({ pasos }: BandaPasosPublicarProps) => (
  <section className="publica-banda">
    <h1>{T.titulo}</h1>
    <ol className="publica-banda-pasos">
      {pasos.map(({ icono: Icono, texto, detalle }, i) => (
        <li key={texto}>
          <span className="publica-banda-icono">
            <Icono size={24} aria-hidden />
          </span>
          <div>
            <strong>{texto}</strong>
            <p>{detalle}</p>
          </div>
          {i < pasos.length - 1 && <ArrowRight size={20} className="publica-banda-flecha" aria-hidden />}
        </li>
      ))}
    </ol>
  </section>
);
