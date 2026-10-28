import { Baby, Building2, Dog, Home, Trees } from "lucide-react";
import { TEXTOS_ELEGIR_FAMILIA as T } from "../../../constants";
import type { TarjetaPostulanteProps } from "../../../interfaces";
import { haceCuanto, iniciales } from "../../../lib/publicacionesAdopcion";
import { AnilloProgreso } from "../comun/AnilloProgreso";

const ETIQUETA_ESTADO = { pendiente: T.nueva, aceptada: T.aceptada, rechazada: T.rechazada } as const;

/** Postulante en la lista: avatar, estado, íconos-resumen y su anillo de afinidad. */
export const TarjetaPostulante = ({ postulacion: p, afinidad, seleccionada, onElegir }: TarjetaPostulanteProps) => {
  const Vivienda = p.vivienda === "departamento" ? Building2 : p.vivienda === "parcela" ? Trees : Home;
  return (
    <button type="button" className={`ap-postulante ${seleccionada ? "ap-postulante-activa" : ""}`} onClick={onElegir} aria-pressed={seleccionada}>
      <span className="ap-avatar">{iniciales(p.nombre)}</span>
      <span className="ap-postulante-datos">
        <strong>{p.nombre}</strong>
        <small>Postuló {haceCuanto(p.creadaEn)}</small>
        <span className="ap-postulante-iconos" aria-hidden>
          <Vivienda size={14} />
          <Baby size={14} className={p.hayNinos ? "" : "ap-apagado"} />
          <Dog size={14} className={p.otrasMascotas ? "" : "ap-apagado"} />
        </span>
        <span className={`ap-chip ap-chip-post-${p.estado}`}>{ETIQUETA_ESTADO[p.estado]}</span>
      </span>
      <AnilloProgreso porcentaje={afinidad.porcentaje} tamano={54} etiqueta={`${afinidad.porcentaje}%`} />
    </button>
  );
};
