import styles from "../css/PantallaCarga.module.css";
import { GATO_COLA, GATO_CUERPO, GATO_ORIGEN_COLA, GATO_VIEWBOX } from "./logoGato";

interface PantallaCargaProps {
  texto?: string;
}

// Pantalla completa mientras carga la app: el gato del logo moviendo la cola.
export const PantallaCarga = ({ texto = "Cargando…" }: PantallaCargaProps) => (
  <div className={styles.pantalla} role="status" aria-live="polite">
    <svg className={styles.gato} viewBox={GATO_VIEWBOX} aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d={GATO_CUERPO} />
      <path
        className={styles.cola}
        style={{ transformOrigin: GATO_ORIGEN_COLA }}
        fill="currentColor"
        fillRule="evenodd"
        d={GATO_COLA}
      />
    </svg>
    <span className={styles.texto}>{texto}</span>
  </div>
);
