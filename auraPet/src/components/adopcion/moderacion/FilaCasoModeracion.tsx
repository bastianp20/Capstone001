import { TEXTOS_MODERACION as T, TONOS_ADOPCION } from "../../../constants";
import type { FilaCasoModeracionProps } from "../../../interfaces";
import { haceCuanto } from "../../../lib/publicacionesAdopcion";
import { AvatarAnimal } from "../AvatarAnimal";
import { ChipMotivoReporte } from "../reportes/ChipMotivoReporte";

/** Un caso en la lista: foto, nombre, quién publicó, motivo principal y si es urgente. */
export const FilaCasoModeracion = ({ caso: c, activo, onElegir }: FilaCasoModeracionProps) => (
  <button
    type="button"
    className={`mod-fila ${activo ? "mod-fila-activa" : ""} ${c.urgente ? "mod-fila-urgente" : ""}`}
    aria-current={activo || undefined}
    onClick={() => onElegir(c)}
  >
    <AvatarAnimal especie={c.especie} fotoUrl={c.fotoUrl} nombre={c.nombre} tono={TONOS_ADOPCION[0]} tamanoIcono={26} className="mod-fila-foto" />
    <span className="mod-fila-texto">
      <span className="mod-fila-arriba">
        <strong>{c.nombre}</strong>
        <small>{haceCuanto(c.ultimoReporte)}</small>
      </span>
      <small>{T.por(c.publicador, c.comuna)}</small>
      <span className="mod-fila-chips">
        <ChipMotivoReporte motivo={c.motivoPrincipal} />
        {c.reportes > 1 && <span className="mod-chip-gris">{T.reportes(c.reportes)}</span>}
        {c.urgente && c.decision === null && <span className="mod-chip-urgente">{T.urgente}</span>}
        {c.esPrueba && <span className="mod-chip-gris">{T.prueba}</span>}
      </span>
    </span>
  </button>
);
