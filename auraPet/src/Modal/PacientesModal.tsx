import { useState } from "react";
import { Iconos } from "../constants";
import { getPacienteByVeterinarioId } from "../Api/getInfo";
import { useConsulta } from "../hooks/useConsulta";
import { faltanDatosClinicos } from "../lib/fichaPaciente";
import { FichaPacienteModal } from "./FichaPacienteModal";
import styles from "../css/Modal.module.css";
import propias from "../css/modal/PacientesModal.module.css";
import type { ModalPacientesProps } from "../interfaces";


// muestra los pacientes (mascotas únicas) de éste veterinario, resueltos
// por id desde Api/getInfo.tsx — no las citas, sino la mascota agrupada.
// "Ver más" abre la ficha del paciente encima de esta lista.
export const PacientesModal = ({ veterinarioId, onCerrar, onRecetar }: ModalPacientesProps) => {
  const [recarga, setRecarga] = useState(0);
  const { datos: pacientes = [], cargando } = useConsulta(() => getPacienteByVeterinarioId(veterinarioId), [veterinarioId, recarga]);
  const [fichaAbierta, setFichaAbierta] = useState<number | null>(null);

  // Al cerrar la ficha se recarga la lista (pudo cambiar el peso, p. ej.)
  const cerrarFicha = () => {
    setFichaAbierta(null);
    setRecarga((n) => n + 1);
  };

  return (
    <>
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Mis Pacientes</h3>
          <button className={styles.closeButton} onClick={onCerrar}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {cargando && <p>Cargando…</p>}
          {!cargando && pacientes.length === 0 && <p>Aún no tienes pacientes asignados.</p>}

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
              <div className={propias.filaAcciones}>
                {faltanDatosClinicos(p) && <span className={propias.chipIncompleta}>Ficha incompleta</span>}
                <button type="button" className={propias.botonVerMas} onClick={() => setFichaAbierta(p.id)}>
                  Ver más <Iconos.verMas size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {fichaAbierta !== null && (
      <FichaPacienteModal mascotaId={fichaAbierta} onCerrar={cerrarFicha} onRecetar={onRecetar} />
    )}
    </>
  );
};