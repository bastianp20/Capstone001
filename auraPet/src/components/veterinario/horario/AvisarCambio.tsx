import { useId } from "react";
import { MAX_CARACTERES_AVISO, TEXTOS_MI_HORARIO as T } from "../../../constants";
import type { AvisarCambioProps } from "../../../interfaces";
import { ContadorCaracteres } from "../../ui/ContadorCaracteres";
import styles from "../../../css/modal/CambioHorario.module.css";

const inicial = (nombre: string) => nombre.trim().charAt(0).toUpperCase() || "?";

// "¿A quién avisamos?": el dueño siempre; el centro, si la cita es de uno y el
// veterinario lo deja marcado. Debajo, el mensaje (sugerido y editable).
export const AvisarCambio = ({ dueno, centros, avisarCentro, onAvisarCentro, mensaje, onMensaje, deshabilitado }: AvisarCambioProps) => {
  const id = useId();
  return (
    <div className={styles.grupo}>
      <span className={styles.etiqueta}>{T.aQuienAvisamos}</span>

      <div className={`${styles.destinatario} ${styles.destinatarioFijo}`}>
        <input type="checkbox" checked disabled aria-label={T.dueno(dueno)} />
        <span className={styles.inicial} aria-hidden="true">{inicial(dueno)}</span>
        <span className={styles.destinatarioTexto}>
          {T.dueno(dueno)}
          <span className={styles.nota}>{T.siempreDueno}</span>
        </span>
      </div>

      {centros.length > 0 && (
        <label className={styles.destinatario}>
          <input
            type="checkbox"
            checked={avisarCentro}
            onChange={(e) => onAvisarCentro(e.target.checked)}
            disabled={deshabilitado}
          />
          <span className={styles.inicial} aria-hidden="true">{inicial(centros[0])}</span>
          <span className={styles.destinatarioTexto}>{T.centro(centros.join(", "))}</span>
        </label>
      )}

      <label htmlFor={`${id}-mensaje`} className={`${styles.etiqueta} ${styles.etiquetaMensaje}`}>{T.mensaje}</label>
      <textarea
        id={`${id}-mensaje`}
        className={styles.textarea}
        value={mensaje}
        onChange={(e) => onMensaje(e.target.value)}
        maxLength={MAX_CARACTERES_AVISO}
        rows={4}
        disabled={deshabilitado}
      />
      <ContadorCaracteres actual={mensaje.length} maximo={MAX_CARACTERES_AVISO} />
    </div>
  );
};
