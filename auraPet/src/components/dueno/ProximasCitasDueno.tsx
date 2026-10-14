import styles from "../../css/DuenoSecciones.module.css";
import { Badge, badgeStyles, ESTADO_LABEL } from "../../constants";
import type { ProximasCitasDuenoProps } from "../../interfaces";

// Panel "Próximas citas": fecha, mascota, centro, motivo, estado y botón cancelar.
// La urgencia no se muestra al dueño: es una decisión clínica del veterinario.
export const ProximasCitasDueno = ({ citas, onCancelar, cancelandoId }: ProximasCitasDuenoProps) => (
  <section className="dueno-panel">
    <div className="dueno-panel-header">Próximas citas</div>

    {citas.length === 0 && <div className="dueno-panel-vacio">No tienes citas agendadas.</div>}

    {citas.map((c) => (
      <div key={c.id} className="dueno-cita-fila">
        <div className="dueno-cita-fecha">
          <span className="dueno-cita-fecha-dia">{c.dia}</span>
          <span className="dueno-cita-fecha-mes">{c.mes}</span>
        </div>
        <div className="dueno-cita-info">
          <div className="dueno-cita-mascota">
            {c.mascota} <span className={styles.horaCita}>· {c.hora}</span>
          </div>
          <div className="dueno-cita-motivo">
            {c.centro} — <span>{c.motivo}</span>
          </div>
        </div>
        <div className="dueno-cita-badges">
          <span style={Badge(badgeStyles[c.estado])}>{ESTADO_LABEL[c.estado]}</span>
          {c.puedeCancelar && (
            <button type="button" className={styles.botonCancelar} disabled={cancelandoId === c.id}
              onClick={() => onCancelar(c.id)}>
              {cancelandoId === c.id ? "Cancelando…" : "Cancelar"}
            </button>
          )}
        </div>
      </div>
    ))}
  </section>
);
