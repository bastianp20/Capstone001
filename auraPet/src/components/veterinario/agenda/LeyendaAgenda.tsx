import { TEXTOS_MI_AGENDA as T } from "../../../constants";
import styles from "../../../css/veterinario/MiAgenda.module.css";

// Qué significa cada color de la grilla
export const LeyendaAgenda = () => (
  <ul className={styles.leyenda} aria-label={T.leyendaTitulo}>
    <li><span className={`${styles.muestra} ${styles.libre}`} aria-hidden="true" />{T.leyenda.libre}</li>
    <li><span className={`${styles.muestra} ${styles.tomada}`} aria-hidden="true" />{T.leyenda.tomada}</li>
    <li><span className={`${styles.muestra} ${styles.pendiente}`} aria-hidden="true" />{T.leyenda.pendiente}</li>
    <li><span className={`${styles.muestra} ${styles.bloqueada}`} aria-hidden="true" />{T.leyenda.bloqueada}</li>
    <li><span className={`${styles.muestra} ${styles.pasada}`} aria-hidden="true" />{T.leyenda.pasada}</li>
  </ul>
);
