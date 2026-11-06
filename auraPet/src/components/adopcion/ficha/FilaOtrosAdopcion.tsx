import { ChevronLeft, ChevronRight } from "lucide-react";
import { TEXTOS_FICHA_ADOPCION as T, TONOS_ADOPCION } from "../../../constants";
import { useFilaDesplazable } from "../../../hooks/useFilaDesplazable";
import type { FilaOtrosAdopcionProps } from "../../../interfaces";
import { TarjetaOtroAdopcion } from "./TarjetaOtroAdopcion";

/** "Otros que también buscan hogar": fila deslizable con flechas. */
export const FilaOtrosAdopcion = ({ animales, onConocer }: FilaOtrosAdopcionProps) => {
  const { ref, anterior, siguiente } = useFilaDesplazable<HTMLDivElement>();
  if (!animales.length) return null;

  return (
    <section className="ficha-otros">
      <div className="ficha-otros-cabecera">
        <h2>{T.otros}</h2>
        <div className="ficha-otros-flechas">
          <button type="button" className="adopta-icono-btn" onClick={anterior} aria-label={T.anterior}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="adopta-icono-btn" onClick={siguiente} aria-label={T.siguiente}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div ref={ref} className="ficha-otros-fila">
        {animales.map((a, i) => (
          <TarjetaOtroAdopcion key={a.id} animal={a} tono={TONOS_ADOPCION[i % TONOS_ADOPCION.length]} onConocer={onConocer} />
        ))}
      </div>
    </section>
  );
};
