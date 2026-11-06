import styles from "../../css/modal/RecetaModal.module.css";
import { ATAJOS_PROXIMO_CONTROL } from "../../constants";
import { fechaDentroDe } from "../../lib/fechas";
import type { ProximoControlProps } from "../../interfaces";

// Fecha del próximo control: un calendario y atajos ("En 7 días", ...).
// El valor es "YYYY-MM-DD", el mismo formato de la columna date de la base.
export const ProximoControl = ({ valor, onCambiar }: ProximoControlProps) => {
  const hoy = fechaDentroDe(0); // para no permitir fechas pasadas en el calendario

  return (
    <div className={styles.filaControl}>
      <input
        type="date"
        className={`${styles.input} ${styles.inputFecha}`}
        value={valor}
        min={hoy}
        onChange={(e) => onCambiar(e.target.value)}
        aria-label="Fecha del próximo control"
      />
      {ATAJOS_PROXIMO_CONTROL.map((atajo) => {
        const fecha = fechaDentroDe(atajo.dias);
        return (
          <button
            key={atajo.dias}
            type="button"
            // Se marca el atajo si la fecha elegida coincide con él
            className={valor === fecha ? styles.atajoActivo : styles.atajo}
            onClick={() => onCambiar(valor === fecha ? "" : fecha)} // segundo clic = quitar
          >
            {atajo.texto}
          </button>
        );
      })}
    </div>
  );
};
