import type { CSSProperties } from "react";
import type { FilaTablaProps } from "../../interfaces";
import styles from "../../css/ui/TablaPanel.module.css";

// Una fila de TablaPanel. "columnas" tiene que ser la misma de la tabla.
export const FilaTabla = ({ columnas, atenuada, children }: FilaTablaProps) => (
  <div className={`${styles.fila} ${atenuada ? styles.filaAtenuada : ""}`} style={{ "--columnas": columnas } as CSSProperties} role="row">
    {children}
  </div>
);
