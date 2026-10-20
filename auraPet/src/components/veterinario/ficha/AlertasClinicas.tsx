import { Iconos } from "../../../constants";
import type { AlertasClinicasProps } from "../../../interfaces";
import styles from "../../../css/ficha/FichaPaciente.module.css";

// Alergias (rojo) y condiciones crónicas (ámbar), arriba de todo en la ficha:
// es lo primero que un veterinario tiene que ver antes de atender o recetar.
export const AlertasClinicas = ({ alergias, condicionesCronicas }: AlertasClinicasProps) => {
  if (!alergias && !condicionesCronicas) return null;

  return (
    <div className={styles.alertas}>
      {alergias && (
        <div className={`${styles.alerta} ${styles.alertaAlergia}`} role="alert">
          <Iconos.advertencia size={18} className={styles.alertaIcono} aria-hidden="true" />
          <span><strong>Alergias</strong>{alergias}</span>
        </div>
      )}
      {condicionesCronicas && (
        <div className={`${styles.alerta} ${styles.alertaCondicion}`}>
          <Iconos.urgenciaMedia size={18} className={styles.alertaIcono} aria-hidden="true" />
          <span><strong>Condiciones crónicas</strong>{condicionesCronicas}</span>
        </div>
      )}
    </div>
  );
};
