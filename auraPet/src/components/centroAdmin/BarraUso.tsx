import type { CSSProperties } from "react";
import type { BarraUsoProps } from "../../interfaces";
import styles from "../../css/centroAdmin/Suscripcion.module.css";

// "Veterinarios  2 de 2" con su barra. Al llegar al límite se pone ámbar.
export const BarraUso = ({ etiqueta, usado, limite }: BarraUsoProps) => {
  const proporcion = Math.min(1, usado / limite);
  const lleno = usado >= limite;
  return (
    <div className={styles.uso}>
      <div className={styles.usoCabecera}>
        <span className={styles.usoEtiqueta}>{etiqueta}</span>
        <span className={styles.usoValor}>{usado} de {limite}</span>
      </div>
      <div
        className={`${styles.barra} ${lleno ? styles.barraLlena : ""}`}
        role="progressbar"
        aria-label={etiqueta}
        aria-valuenow={usado}
        aria-valuemin={0}
        aria-valuemax={limite}
      >
        <div className={styles.barraRelleno} style={{ "--progreso": `${proporcion * 100}%` } as CSSProperties} />
      </div>
    </div>
  );
};
