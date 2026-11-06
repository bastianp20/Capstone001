import { Iconos, TEXTOS_SOLICITUD } from "../../constants";
import type { TarjetaResumenProps } from "../../interfaces";

// Resumen de un paso en el paso "Revisar", con link para volver a editarlo
export const TarjetaResumen = ({ titulo, filas, onEditar }: TarjetaResumenProps) => (
  <section className="solicitud-resumen">
    <header className="solicitud-resumen-cabecera">
      <h3>{titulo}</h3>
      <button type="button" className="solicitud-link" onClick={onEditar}>
        <Iconos.editar size={14} aria-hidden="true" /> {TEXTOS_SOLICITUD.editar}
      </button>
    </header>
    <dl className="solicitud-resumen-filas">
      {filas.map((f) => (
        <div key={f.etiqueta} className="solicitud-resumen-fila">
          <dt>{f.etiqueta}</dt>
          <dd>{f.valor || "—"}</dd>
        </div>
      ))}
    </dl>
  </section>
);
