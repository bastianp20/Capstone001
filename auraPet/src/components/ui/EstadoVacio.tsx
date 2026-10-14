import styles from "../../css/ui/Panel.module.css";
import type { EstadoVacioProps } from "../../interfaces";

// Mensaje para cuando una lista no tiene nada ("No tienes citas hoy").
export const EstadoVacio = ({ texto, icono }: EstadoVacioProps) => (
  <div className={styles.vacio}>
    {icono}
    <span>{texto}</span>
  </div>
);
