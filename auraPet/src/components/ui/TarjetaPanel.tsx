import styles from "../../css/ui/Panel.module.css";
import type { TarjetaPanelProps } from "../../interfaces";

// Tarjeta blanca con título opcional y algo a la derecha (un botón, un selector).
// Es la "caja" base de los paneles.
export const TarjetaPanel = ({ titulo, accion, className, children }: TarjetaPanelProps) => (
  <section className={`${styles.tarjeta} ${className ?? ""}`}>
    {(titulo || accion) && (
      <div className={styles.tarjetaEncabezado}>
        {titulo && <h2 className={styles.tarjetaTitulo}>{titulo}</h2>}
        {accion}
      </div>
    )}
    {children}
  </section>
);
