import { Iconos } from "../../constants";
import type { SpinnerProps } from "../../interfaces";
import styles from "../../css/ui/Spinner.module.css";

// Ícono de carga girando. Se usa dentro de botones mientras algo se guarda.
export const Spinner = ({ tamano = 16 }: SpinnerProps) => (
  <Iconos.cargando size={tamano} className={styles.spinner} aria-hidden="true" />
);
