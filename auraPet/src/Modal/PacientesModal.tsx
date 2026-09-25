import { getPacienteByVeterinarioId } from "../Api/getInfo";
import styles from "../css/Modal.module.css";
import type { ModalPacientesProps } from "../interfaces";


// muestra los pacientes (mascotas únicas) de éste veterinario, resueltos
// por id desde Api/getInfo.tsx — no las citas, sino la mascota agrupada.
export const PacientesModal = ({ veterinarioId, onCerrar }: ModalPacientesProps) => {
  const pacientes = getPacienteByVeterinarioId(veterinarioId);

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Mis Pacientes</h3>
          <button className={styles.closeButton} onClick={onCerrar}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {pacientes.length === 0 && <p>Aún no tienes pacientes asignados.</p>}

          {pacientes.map((p) => (
            <div key={p.id} className={styles.agendaItem}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{p.nombre}</strong>
                <span style={{ color: "var(--color-text-muted)" }}>
                  {p.totalVisitas} {p.totalVisitas === 1 ? "visita" : "visitas"}
                </span>
              </div>
              <span>
                {p.especie} · {p.raza} — {p.dueno}
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>Última visita: {p.ultimaVisita}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};