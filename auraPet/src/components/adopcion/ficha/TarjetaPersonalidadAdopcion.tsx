import { ETIQUETAS_RASGOS_ADOPCION, RASGOS_ADOPCION, TEXTOS_FICHA_ADOPCION as T } from "../../../constants";
import type { TarjetaPersonalidadAdopcionProps } from "../../../interfaces";
import { BarraRasgoAdopcion } from "./BarraRasgoAdopcion";

/** Etiquetas de personalidad + barras de los rasgos que se conocen. */
export const TarjetaPersonalidadAdopcion = ({ personalidad, rasgos }: TarjetaPersonalidadAdopcionProps) => {
  const conocidos = RASGOS_ADOPCION.filter((r) => rasgos[r] !== null);
  if (!personalidad.length && !conocidos.length) return null;

  return (
    <section className="ficha-tarjeta">
      <h2>{T.personalidad}</h2>
      <div className="ficha-personalidad">
        <div className="adopta-etiquetas">
          {personalidad.map((p) => (
            <span key={p} className="adopta-etiqueta">
              {p}
            </span>
          ))}
        </div>
        {conocidos.length > 0 && (
          <div className="ficha-rasgos">
            {conocidos.map((r) => (
              <BarraRasgoAdopcion key={r} etiqueta={ETIQUETAS_RASGOS_ADOPCION[r]} valor={rasgos[r]} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
