import { useState } from "react";
import { badgeStyles, Badge, ESTADO_LABEL, URGENCIA_LABEL } from "../constants";
import { getAgendaVeterinario } from "../Api/getInfo";
import { actualizarMiCita, rechazarCita } from "../Api/postInfo";
import { useConsulta } from "../hooks/useConsulta";
import { useAccion } from "../hooks/useAccion";
import { RechazarModal } from "./ReachazarModal";
import type { ModalAgendaProps, PestanaAgenda, CitaAgendaItem } from "../interfaces";
import styles from "../css/Modal.module.css";

// Muestra las citas de éste veterinario, resueltas por id (mascota, dueño,
// especie/raza) desde Api/getInfo.tsx, en dos pestañas:
//  · "Por confirmar": solicitudes pendientes que pidieron los dueños, con
//    botones para confirmarlas o rechazarlas (el rechazo pide una razón).
//  · "Agenda": el resto de sus citas (confirmadas, en curso, completadas...).
export const ModalAgenda = ({ veterinarioId, pestanaInicial = "agenda", onCerrar, onCambio }: ModalAgendaProps) => {
  const [pestana, setPestana] = useState<PestanaAgenda>(pestanaInicial);
  const [recarga, setRecarga] = useState(0);
  const { datos: agenda = [], cargando, error } = useConsulta(
    () => getAgendaVeterinario(veterinarioId),
    [veterinarioId, recarga]
  );

  const { ejecutar: ejecutarAccion, ocupado, error: errorAccion } = useAccion();
  // La cita que se está rechazando (abre RechazarModal encima de la agenda)
  const [citaARechazar, setCitaARechazar] = useState<CitaAgendaItem | null>(null);

  const porConfirmar = agenda.filter((c) => c.estado === "pendiente");
  const resto = agenda.filter((c) => c.estado !== "pendiente");
  const lista = pestana === "por_confirmar" ? porConfirmar : resto;

  // Corre una acción sobre una cita y, si sale bien, recarga la agenda y avisa al inicio
  const ejecutar = async (accion: () => Promise<void>, mensajeError: string) => {
    if (await ejecutarAccion(accion, mensajeError)) {
      setRecarga((n) => n + 1);
      onCambio?.();
    }
  };

  const confirmar = (citaId: number) =>
    ejecutar(() => actualizarMiCita(citaId, { estado: "confirmada" }), "No se pudo confirmar la cita.");

  // El modal de rechazo queda abierto (mostrando "Rechazando…") hasta que responde la base;
  // si falla, el error se ve en la agenda.
  const confirmarRechazo = async (razon: string) => {
    if (!citaARechazar) return;
    await ejecutar(() => rechazarCita(citaARechazar.id, razon), "No se pudo rechazar la cita.");
    setCitaARechazar(null);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onCerrar}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h3 className={styles.title}>Mi Agenda</h3>
            <button className={styles.closeButton} onClick={onCerrar}>
              ×
            </button>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${pestana === "por_confirmar" ? styles.tabActiva : ""}`}
              onClick={() => setPestana("por_confirmar")}
            >
              Por confirmar
              {porConfirmar.length > 0 && <span className={styles.tabContador}>{porConfirmar.length}</span>}
            </button>
            <button
              className={`${styles.tab} ${pestana === "agenda" ? styles.tabActiva : ""}`}
              onClick={() => setPestana("agenda")}
            >
              Agenda
            </button>
          </div>

          <div className={styles.content}>
            {(error || errorAccion) && <div className={styles.errorAccion}>{errorAccion ?? error}</div>}
            {cargando && <p>Cargando…</p>}
            {!cargando && lista.length === 0 && (
              <p>{pestana === "por_confirmar" ? "No tienes solicitudes por confirmar." : "No hay citas asignadas."}</p>
            )}

            {lista.map((c) => (
              <div key={c.id} className={styles.agendaItem}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{c.fecha}</strong>
                  <span style={Badge(badgeStyles[c.urgencia])}>{URGENCIA_LABEL[c.urgencia]}</span>
                </div>
                <span>
                  {c.mascota} ({c.especie} · {c.raza}) — {c.dueno}
                </span>
                <span style={{ color: "var(--color-text-muted)" }}>{c.motivo}</span>

                {c.estado === "pendiente" ? (
                  <div className={styles.itemAcciones}>
                    <button
                      className={`${styles.btnChico} ${styles.btnChicoConfirmar}`}
                      disabled={ocupado}
                      onClick={() => confirmar(c.id)}
                    >
                      Confirmar
                    </button>
                    <button
                      className={`${styles.btnChico} ${styles.btnChicoRechazar}`}
                      disabled={ocupado}
                      onClick={() => setCitaARechazar(c)}
                    >
                      Rechazar
                    </button>
                  </div>
                ) : (
                  <span style={Badge(badgeStyles[c.estado])}>{ESTADO_LABEL[c.estado]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de rechazo (el mismo que usa el superadmin), encima de la agenda */}
      {citaARechazar && (
        <RechazarModal
          nombreSolicitud={`${citaARechazar.mascota} · ${citaARechazar.fecha}`}
          ocupado={ocupado}
          onCancelar={() => setCitaARechazar(null)}
          onConfirmar={confirmarRechazo}
        />
      )}
    </>
  );
};
