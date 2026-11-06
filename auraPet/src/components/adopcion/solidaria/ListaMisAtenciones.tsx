import { Heart } from "lucide-react";
import { TEXTOS_SOLIDARIA as T, TONOS_ADOPCION } from "../../../constants";
import type { ListaMisAtencionesProps } from "../../../interfaces";
import { formatFechaLarga } from "../../../lib/fechas";
import { AvatarAnimal } from "../AvatarAnimal";

/** "Mis atenciones": lo que ya registró, con el estado actual de cada animal. */
export const ListaMisAtenciones = ({ atenciones, onVerFicha }: ListaMisAtencionesProps) => (
  <ul className="ap-atenciones">
    {atenciones.map((a, i) => (
      <li key={a.id}>
        <button type="button" className="ap-atencion" onClick={() => onVerFicha(a.adopcionId)}>
          <AvatarAnimal especie={a.especie} fotoUrl={a.fotoUrl} nombre={a.nombre} tono={TONOS_ADOPCION[i % TONOS_ADOPCION.length]} tamanoIcono={26} className="ap-atencion-foto" />
          <span className="ap-atencion-texto">
            <strong>{a.nombre}</strong>
            <span>{a.resumen}</span>
            <small className="ap-suave">
              {formatFechaLarga(a.fecha)}
              {a.centro && ` · ${a.centro}`}
            </small>
          </span>
          <span className="ap-chips">
            {a.solidario ? (
              <span className="ap-chip ap-chip-solidaria">
                <Heart size={12} fill="currentColor" aria-hidden /> {T.solidaria}
              </span>
            ) : (
              <span className="ap-chip">{T.conCosto}</span>
            )}
            {a.estado === "adoptada" && <span className="ap-chip ap-chip-adoptada">{T.adoptado}</span>}
            {a.estado === "en_proceso" && <span className="ap-chip ap-chip-en_proceso">{T.enProceso}</span>}
          </span>
        </button>
      </li>
    ))}
  </ul>
);
