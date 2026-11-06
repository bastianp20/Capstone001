import { ArrowRight } from "lucide-react";
import { PASOS_DAR_EN_ADOPCION, TEXTOS_ADOPCION as T } from "../../constants";
import type { BandaDarEnAdopcionProps } from "../../interfaces";

/** Banda verde: "¿Necesitas darle un hogar a un animal?" con los 3 pasos. */
export const BandaDarEnAdopcion = ({ onPublicar }: BandaDarEnAdopcionProps) => (
  <section className="adopta-banda">
    <div className="adopta-banda-contenido">
      <h2>{T.bandaTitulo}</h2>
      <ol className="adopta-pasos">
        {PASOS_DAR_EN_ADOPCION.map(({ icono: Icono, texto }, i) => (
          <li key={texto}>
            <span className="adopta-paso-icono">
              <Icono size={22} aria-hidden />
            </span>
            <span>{texto}</span>
            {i < PASOS_DAR_EN_ADOPCION.length - 1 && <ArrowRight size={18} className="adopta-paso-flecha" aria-hidden />}
          </li>
        ))}
      </ol>
      <button type="button" className="adopta-btn adopta-btn-blanco" onClick={onPublicar}>
        {T.publicar}
      </button>
    </div>
  </section>
);
