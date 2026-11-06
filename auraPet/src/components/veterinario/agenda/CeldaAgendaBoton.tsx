import { ESTADO_LABEL, TEXTOS_MI_AGENDA as T, TEXTOS_MI_HORARIO } from "../../../constants";
import { formatDiaConNombre } from "../../../lib/fechas";
import { citaModificable } from "../../../lib/miHorario";
import type { CeldaAgendaProps } from "../../../interfaces";
import styles from "../../../css/veterinario/MiAgenda.module.css";

// Una hora de la grilla. Según su tipo se ve y actúa distinto:
// libre → bloquear · con cita → modificar · bloqueada → quitar bloqueo · pasada → nada.
export const CeldaAgendaBoton = ({ celda, onElegir }: CeldaAgendaProps) => {
  if (!celda) return null;
  const dia = formatDiaConNombre(celda.fecha);

  if (celda.tipo === "tomada" && celda.cita) {
    const c = celda.cita;
    const activa = citaModificable(c);
    return (
      <button
        type="button"
        className={`${styles.celda} ${styles.tomada} ${c.estado === "pendiente" ? styles.pendiente : ""} ${activa ? "" : styles.tomadaPasada}`}
        onClick={() => onElegir(celda)}
        disabled={!activa}
        aria-label={T.etiquetaCelda.tomada(dia, celda.hora, c.mascota)}
        title={`${c.mascota} · ${c.dueno} · ${c.motivo}`}
      >
        <span className={styles.celdaTitulo}>{c.mascota}</span>
        <span className={styles.celdaDetalle}>
          {celda.fueraDeHorario ? `${celda.hora} · ${T.fueraDeHorario}` : ESTADO_LABEL[c.estado]}
          {c.reagendada && ` · ${TEXTOS_MI_HORARIO.reagendada}`}
        </span>
      </button>
    );
  }

  if (celda.tipo === "bloqueada" && celda.bloqueo) {
    return (
      <button type="button" className={`${styles.celda} ${styles.bloqueada}`} onClick={() => onElegir(celda)}
        aria-label={T.etiquetaCelda.bloqueada(dia, celda.hora)} title={celda.bloqueo.motivo}>
        <span className={styles.celdaTitulo}>{T.bloqueado}</span>
        <span className={styles.celdaDetalle}>{celda.bloqueo.motivo}</span>
      </button>
    );
  }

  if (celda.tipo === "pasada") {
    return (
      <button type="button" className={`${styles.celda} ${styles.pasada}`} disabled aria-label={T.etiquetaCelda.pasada(dia, celda.hora)}>
        &nbsp;
      </button>
    );
  }

  return (
    <button type="button" className={`${styles.celda} ${styles.libre}`} onClick={() => onElegir(celda)}
      aria-label={T.etiquetaCelda.libre(dia, celda.hora)}>
      {T.libre}
    </button>
  );
};
