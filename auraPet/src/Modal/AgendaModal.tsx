import { badgeStyles, Badge, ESTADO_LABEL, URGENCIA_LABEL } from "../constants";
import { getAgendaVeterinario } from "../Api/getInfo";
import styles from "../css/Modal.module.css";

interface ModalAgendaProps {
  veterinarioId: number;
  onCerrar: () => void;
}

// muestra las citas de éste veterinario, resueltas
// por id (mascota, dueño, especie/raza) desde Api/getInfo.tsx
export const ModalAgenda = ({ veterinarioId, onCerrar }: ModalAgendaProps) => {
  const agenda = getAgendaVeterinario(veterinarioId);

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Mi Agenda</h3>
          <button className={styles.closeButton} onClick={onCerrar}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {agenda.length === 0 && <p>No hay citas asignadas.</p>}

          {agenda.map((c) => (
            <div key={c.id} className={styles.agendaItem}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{c.hora}</strong>
                <span style={Badge(badgeStyles[c.urgencia])}>{URGENCIA_LABEL[c.urgencia]}</span>
              </div>
              <span>
                {c.mascota} ({c.especie} · {c.raza}) — {c.dueno}
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>{c.motivo}</span>
              <span style={Badge(badgeStyles[c.estado])}>{ESTADO_LABEL[c.estado]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};