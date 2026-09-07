import { useState } from "react";
import type { RechazarModalProps } from "../interfaces";
import styles from "./Modal.module.css";

export const RechazarModal = ({ nombreSolicitud, onCancelar, onConfirmar }: RechazarModalProps) => {
  const [razon, setRazon] = useState("");

  return (
    <div className={styles.overlay} onClick={onCancelar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Rechazar solicitud: {nombreSolicitud}</h3>
          <button className={styles.closeButton} onClick={onCancelar}>
            ×
          </button>
        </div>

        <label className={styles.label}>
          Razón de rechazo <span className={styles.required}>(requerido)</span>
        </label>
        <textarea
          className={styles.textarea}
          value={razon}
          onChange={(e) => setRazon(e.target.value)}
          rows={4}
          placeholder="Explica brevemente por qué se rechaza esta solicitud…"
        />

        <div className={styles.actions}>
          <button className={styles.btnCancelar} onClick={onCancelar}>
            Cancelar
          </button>
          <button
            className={styles.btnConfirmar}
            disabled={razon.trim().length === 0}
            onClick={() => onConfirmar(razon)}
          >
            Confirmar rechazo
          </button>
        </div>
      </div>
    </div>
  );
};
