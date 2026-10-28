import { MapPin, UserRound } from "lucide-react";
import { TEXTOS_MIS_PUBLICACIONES as T, TONOS_ADOPCION } from "../../../constants";
import type { TarjetaPublicacionDestacadaProps } from "../../../interfaces";
import { AvatarAnimal } from "../AvatarAnimal";
import { CaminoCasa } from "./CaminoCasa";

/** El bloque grande: la publicación con más movimiento y su camino a casa. */
export const TarjetaPublicacionDestacada = ({ publicacion: p, onRevisar }: TarjetaPublicacionDestacadaProps) => (
  <article className="ap-destacada">
    <AvatarAnimal especie={p.especie} fotoUrl={p.fotoUrl} nombre={p.nombre} tono={TONOS_ADOPCION[0]} tamanoIcono={88} className="ap-destacada-foto" />
    <div className="ap-destacada-cuerpo">
      <div>
        <h2>{p.nombre}</h2>
        <p className="ap-suave">
          {p.raza} · {p.edad} · <MapPin size={13} aria-hidden /> {p.comuna}
        </p>
      </div>
      <CaminoCasa publicacion={p} />
      <div className="ap-destacada-pie">
        {p.nuevas > 0 ? (
          <span className="ap-avatares">
            {Array.from({ length: Math.min(3, p.nuevas) }, (_, i) => (
              <span key={i} className={`ap-avatar-mini ap-tono-${["durazno", "lavanda", "menta"][i]}`} aria-hidden>
                <UserRound size={14} />
              </span>
            ))}
            <strong>{T.nuevasPostulaciones(p.nuevas)}</strong>
          </span>
        ) : (
          <span className="ap-suave">{p.elegido ? T.enProcesoCon(p.elegido) : T.sinNuevas}</span>
        )}
        <button type="button" className="ap-btn ap-btn-primario" onClick={() => onRevisar(p)}>
          {T.revisarPostulaciones}
        </button>
      </div>
    </div>
  </article>
);
