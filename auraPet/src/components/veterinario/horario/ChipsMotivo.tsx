import styles from "../../../css/modal/CambioHorario.module.css";
import type { ChipsMotivoProps } from "../../../interfaces";

// Motivos como chips de selección única (Imprevisto personal, Urgencia médica…).
export const ChipsMotivo = ({ etiqueta, opciones, valor, onCambiar, deshabilitado }: ChipsMotivoProps) => (
  <fieldset className={styles.fieldset}>
    <legend className={`${styles.etiqueta} ${styles.leyenda}`}>{etiqueta}</legend>
    <div className={styles.chips}>
      {opciones.map((opcion) => (
        <button
          key={opcion}
          type="button"
          className={`${styles.chip} ${valor === opcion ? styles.chipActivo : ""}`}
          aria-pressed={valor === opcion}
          onClick={() => onCambiar(opcion)}
          disabled={deshabilitado}
        >
          {opcion}
        </button>
      ))}
    </div>
  </fieldset>
);
