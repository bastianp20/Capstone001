import type { HistorialRecienteProps } from "../../interfaces";

// Panel "Historial reciente": línea de tiempo con lo último del historial médico.
export const HistorialReciente = ({ items }: HistorialRecienteProps) => (
  <section className="dueno-panel">
    <div className="dueno-panel-header">Historial reciente</div>
    <div className="dueno-historial-lista">
      {items.length === 0 && <div className="dueno-panel-vacio">Aún no hay historial médico.</div>}
      {items.map((h) => (
        <div key={h.id} className="dueno-historial-item">
          <div className="dueno-historial-linea">
            <div className="dueno-historial-punto" />
            <div className="dueno-historial-hilo" />
          </div>
          <div className="dueno-historial-texto">
            <div className="dueno-historial-desc">{h.descripcion}</div>
            <div className="dueno-historial-meta">{h.mascota} · {h.fecha}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);
