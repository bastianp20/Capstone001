import { Heart, Share2 } from "lucide-react";
import { TEXTOS_FICHA_ADOPCION as T } from "../../../constants";
import type { TarjetaPublicadorAdopcionProps } from "../../../interfaces";

const iniciales = (nombre: string) =>
  nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

/** Columna lateral: quién lo cuida, "Quiero adoptarlo", compartir y guardar. */
export const TarjetaPublicadorAdopcion = ({
  publicador, nombreAnimal, sexo, estadoBoton, guardado, textoCompartir, onAdoptar, onCompartir, onGuardar,
}: TarjetaPublicadorAdopcionProps) => {
  const disponible = estadoBoton === "disponible";
  return (
    <section className="ficha-publicador" aria-label={`Quién cuida a ${nombreAnimal}`}>
      <span className="ficha-publicador-avatar" aria-hidden>
        {iniciales(publicador.nombre)}
      </span>
      <strong>{publicador.nombre}</strong>
      <span className="ficha-publicador-tipo">{publicador.tipo}</span>
      {publicador.adopciones > 0 && <span className="ficha-publicador-adopciones">{T.adopciones(publicador.adopciones)}</span>}

      <button type="button" className="adopta-btn adopta-btn-primario ficha-btn-adoptar" onClick={onAdoptar} disabled={!disponible}>
        {disponible ? T.quieroAdoptar(sexo) : T.botonDeshabilitado[estadoBoton]}
      </button>
      <div className="ficha-publicador-acciones">
        <button type="button" className="adopta-btn adopta-btn-borde" onClick={onCompartir}>
          <Share2 size={16} aria-hidden /> {textoCompartir}
        </button>
        <button type="button" className={`adopta-btn adopta-btn-borde ${guardado ? "ficha-guardado" : ""}`} onClick={onGuardar} aria-pressed={guardado}>
          <Heart size={16} aria-hidden fill={guardado ? "currentColor" : "none"} /> {guardado ? T.guardado : T.guardar}
        </button>
      </div>
    </section>
  );
};
