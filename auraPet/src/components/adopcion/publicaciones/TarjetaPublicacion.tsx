import { Eye, RotateCcw, Stethoscope, Users, XCircle } from "lucide-react";
import { ESTADO_PUBLICACION_LABEL, TEXTOS_MIS_PUBLICACIONES as T } from "../../../constants";
import type { TarjetaPublicacionProps } from "../../../interfaces";
import { haceCuanto } from "../../../lib/publicacionesAdopcion";
import { AvatarAnimal } from "../AvatarAnimal";
import { CaminoCasa } from "./CaminoCasa";

/** Tarjeta vertical con foto: estado, camino a casa y la acción que corresponde. */
export const TarjetaPublicacion = ({ publicacion: p, tono, onRevisar, onVer, onRetirar, onReactivar }: TarjetaPublicacionProps) => (
  <article className={`ap-publicacion ap-estado-${p.estado}`}>
    <div className="ap-publicacion-foto">
      <AvatarAnimal especie={p.especie} fotoUrl={p.fotoUrl} nombre={p.nombre} tono={tono} tamanoIcono={60} />
      <span className={`ap-chip ap-chip-${p.estado}`}>{ESTADO_PUBLICACION_LABEL[p.estado]}</span>
      {p.estado === "adoptada" && p.testimonio && (
        <figure className="ap-polaroid-mini">
          <span>“{p.testimonio}”</span>
        </figure>
      )}
    </div>
    <div className="ap-publicacion-cuerpo">
      <h3>{p.nombre}</h3>
      <p className="ap-suave">
        {p.raza} · {p.edad} · {p.comuna}
      </p>
      <CaminoCasa publicacion={p} compacto />
      {p.estado === "en_proceso" && p.elegido ? (
        <span className="ap-chip ap-chip-en_proceso">{T.enProcesoCon(p.elegido)}</span>
      ) : p.revisadaPor ? (
        <span className="ap-sello">
          <Stethoscope size={13} aria-hidden /> {T.revisadoPor(p.revisadaPor)}
        </span>
      ) : p.estado === "publicada" ? (
        <span className="ap-chip ap-chip-espera">{T.esperandoAtencion}</span>
      ) : null}
      <p className="ap-publicacion-meta">
        <Users size={13} aria-hidden /> {T.postulaciones(p.postulaciones)}
        {p.nuevas > 0 && <strong className="ap-nuevas"> · {p.nuevas} nuevas</strong>}
        <span> · {haceCuanto(p.adoptadaEn ?? p.creadaEn)}</span>
      </p>
      {p.refugio && <p className="ap-publicacion-meta">{T.aNombreDe(p.refugio)}</p>}
      <div className="ap-publicacion-acciones">
        {(p.estado === "publicada" || p.estado === "en_proceso") && (
          <button type="button" className="ap-btn ap-btn-primario ap-btn-chico" onClick={() => onRevisar(p)}>
            {T.verPostulaciones}
          </button>
        )}
        {p.estado !== "retirada" && (
          <button type="button" className="ap-icono-btn" onClick={() => onVer(p)} aria-label={T.verPublicacion} title={T.verPublicacion}>
            <Eye size={16} />
          </button>
        )}
        {p.estado === "publicada" && (
          <button type="button" className="ap-icono-btn" onClick={() => onRetirar(p)} aria-label={T.retirar} title={T.retirar}>
            <XCircle size={16} />
          </button>
        )}
        {p.estado === "retirada" && (
          <button type="button" className="ap-btn ap-btn-borde ap-btn-chico" onClick={() => onReactivar(p)}>
            <RotateCcw size={14} aria-hidden /> {T.reactivar}
          </button>
        )}
      </div>
    </div>
  </article>
);
