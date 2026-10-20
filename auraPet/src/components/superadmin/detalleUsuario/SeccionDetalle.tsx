import type { SeccionDetalleProps } from "../../../interfaces";
import styles from "../../../css/superadmin/DetalleModal.module.css";

// Bloque con título dentro del detalle de usuario
export const SeccionDetalle = ({ titulo, icono, children, ancha }: SeccionDetalleProps) => (
  <section className={`${styles.seccion} ${ancha ? styles.ancha : ""}`}>
    <h4 className={styles.seccionTitulo}>{icono}{titulo}</h4>
    {children}
  </section>
);
