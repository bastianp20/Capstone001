import { TEXTO_QUITAR_FILTRO } from "../../constants";
import type { FiltroEspecialidadesProps } from "../../interfaces";
import "../../css/FiltroEspecialidades.css";

/** Chips para filtrar por especialidades (se pueden marcar varias). Pedir hora, derivar… */
export const FiltroEspecialidades = ({ especialidades, seleccion, onCambiar, etiqueta, ayuda, tono = "tema" }: FiltroEspecialidadesProps) =>
  especialidades.length ? (
    <fieldset className={`filtro-esp filtro-esp-${tono}`}>
      <legend>{etiqueta}</legend>
      <small>{ayuda}</small>
      <div className="filtro-esp-chips" role="group">
        {especialidades.map((e) => {
          const activa = seleccion.includes(e.id);
          return (
            <button
              key={e.id}
              type="button"
              aria-pressed={activa}
              className={`filtro-esp-chip ${activa ? "filtro-esp-chip-activo" : ""}`}
              onClick={() => onCambiar(activa ? seleccion.filter((x) => x !== e.id) : [...seleccion, e.id])}
            >
              {e.nombre}
            </button>
          );
        })}
        {seleccion.length > 0 && (
          <button type="button" className="filtro-esp-limpiar" onClick={() => onCambiar([])}>
            {TEXTO_QUITAR_FILTRO}
          </button>
        )}
      </div>
    </fieldset>
  ) : null;
