import { PawPrint } from "lucide-react";
import { ALTURAS_TARJETA_ADOPCION, TEXTOS_ADOPCION as T, TONOS_ADOPCION } from "../../constants";
import type { GrillaAdopcionProps } from "../../interfaces";
import { TarjetaAdopcion } from "./TarjetaAdopcion";

/** Mosaico de 3 columnas con alturas alternadas; si no hay resultados, un mensaje amable. */
export const GrillaAdopcion = ({ animales, cargando, hayPublicaciones, error, onLimpiarFiltros, onConocer }: GrillaAdopcionProps) => {
  if (cargando) return <p className="adopta-cargando">{T.cargando}</p>;

  if (error || !hayPublicaciones) {
    return (
      <div className="adopta-vacio" role={error ? "alert" : undefined}>
        <PawPrint size={40} aria-hidden />
        <p>{error ? T.errorCarga : T.sinPublicaciones}</p>
      </div>
    );
  }

  if (!animales.length) {
    return (
      <div className="adopta-vacio">
        <PawPrint size={40} aria-hidden />
        <p>{T.sinResultados}</p>
        <button type="button" className="adopta-btn adopta-btn-borde" onClick={onLimpiarFiltros}>
          {T.limpiarFiltros}
        </button>
      </div>
    );
  }

  return (
    <div className="adopta-grilla">
      {animales.map((a, i) => (
        <TarjetaAdopcion
          key={a.id}
          animal={a}
          alto={ALTURAS_TARJETA_ADOPCION[i % ALTURAS_TARJETA_ADOPCION.length]}
          tono={TONOS_ADOPCION[i % TONOS_ADOPCION.length]}
          onConocer={onConocer}
        />
      ))}
    </div>
  );
};
