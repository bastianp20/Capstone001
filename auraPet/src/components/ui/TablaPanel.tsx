import type { CSSProperties } from "react";
import type { TablaPanelProps } from "../../interfaces";
import styles from "../../css/ui/TablaPanel.module.css";

// Tarjeta blanca con una tabla en grilla: título opcional, encabezados
// y los estados "cargando", "error" y "vacío". Las filas van como children
// (usar FilaTabla con las mismas columnas).
export const TablaPanel = ({ titulo, accion, columnas, encabezados, cargando, error, vacio, cantidad, children }: TablaPanelProps) => (
  <section className={styles.tarjeta}>
    {(titulo || accion) && (
      <header className={styles.cabecera}>
        {titulo && <h2 className={styles.titulo}>{titulo}</h2>}
        {accion}
      </header>
    )}
    <div className={styles.scroll}>
      <div className={styles.encabezados} style={{ "--columnas": columnas } as CSSProperties} role="row">
        {encabezados.map((e, i) => <span key={`${e}-${i}`} role="columnheader">{e}</span>)}
      </div>

      {cargando && <p className={styles.estado}>Cargando…</p>}
      {!cargando && error && <p className={`${styles.estado} ${styles.estadoError}`}>{error}</p>}
      {!cargando && !error && cantidad === 0 && <p className={styles.estado}>{vacio}</p>}
      {!cargando && !error && children}
    </div>
  </section>
);
