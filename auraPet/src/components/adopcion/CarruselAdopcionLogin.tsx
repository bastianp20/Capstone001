import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { INTERVALO_CARRUSEL_ADOPCION_MS, TEXTOS_ADOPCION_LOGIN as T, TONOS_ADOPCION, VISIBLES_CARRUSEL_ADOPCION } from "../../constants";
import { useCarrusel } from "../../hooks/useCarrusel";
import type { CarruselAdopcionLoginProps } from "../../interfaces";
import { MiniTarjetaAdopcion } from "./MiniTarjetaAdopcion";

/** Tarjeta de vidrio del login: "Ellos también buscan hogar", con un carrusel que avanza solo. */
export const CarruselAdopcionLogin = ({ animales, onVerTodos }: CarruselAdopcionLoginProps) => {
  // Se ven 2 tarjetas a la vez; cada paso corre una.
  const posiciones = Math.max(1, animales.length - VISIBLES_CARRUSEL_ADOPCION + 1);
  const c = useCarrusel(posiciones, INTERVALO_CARRUSEL_ADOPCION_MS);

  if (!animales.length) return null;

  return (
    <section
      className="adopcion-login"
      aria-roledescription="carrusel"
      aria-label={T.titulo}
      onMouseEnter={c.pausar}
      onMouseLeave={c.reanudar}
      onFocus={c.pausar}
      onBlur={c.reanudar}
    >
      <h3 className="adopcion-login-titulo">{T.titulo}</h3>

      <div className="adopcion-login-ventana">
        <div className="adopcion-login-pista" style={{ "--indice": c.indice } as CSSProperties}>
          {animales.map((a, i) => (
            <MiniTarjetaAdopcion key={a.id} animal={a} tono={TONOS_ADOPCION[i % TONOS_ADOPCION.length]} />
          ))}
        </div>
        {posiciones > 1 && (
          <>
            <button type="button" className="adopcion-login-flecha adopcion-login-flecha-izq" onClick={c.anterior} aria-label={T.anterior}>
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="adopcion-login-flecha adopcion-login-flecha-der" onClick={c.siguiente} aria-label={T.siguiente}>
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {posiciones > 1 && (
        <div className="adopcion-login-puntos">
          {Array.from({ length: posiciones }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`adopcion-login-punto ${i === c.indice ? "adopcion-login-punto-activo" : ""}`}
              onClick={() => c.irA(i)}
              aria-label={T.irA(i + 1)}
              aria-current={i === c.indice}
            />
          ))}
        </div>
      )}

      <button type="button" className="adopcion-login-ver" onClick={onVerTodos}>
        {T.verTodos} <ArrowRight size={15} />
      </button>
    </section>
  );
};
