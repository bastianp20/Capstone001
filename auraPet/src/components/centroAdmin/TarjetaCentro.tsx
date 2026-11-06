import type { TarjetaCentroProps } from "../../interfaces";
import styles from "../../css/centroAdmin/PanelCentro.module.css";

// Tarjeta blanca con título (y acción opcional a la derecha) del panel del centro.
export const TarjetaCentro = ({ titulo, accion, children }: TarjetaCentroProps) => (
  <section className={styles.tarjeta}>
    <header className={styles.tarjetaCabecera}>
      <h2 className={styles.tarjetaTitulo}>{titulo}</h2>
      {accion}
    </header>
    <div className={styles.tarjetaCuerpo}>{children}</div>
  </section>
);
