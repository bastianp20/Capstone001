import type { CSSProperties } from "react";
import type { EtiquetaProps } from "../../interfaces";
import styles from "../../css/ui/Etiqueta.module.css";

// Píldora de color para estados ("Verificado", "Prueba", "Activa"...).
// Los colores llegan por props (desde constants.ts) como variables CSS.
export const Etiqueta = ({ texto, fondo, color }: EtiquetaProps) => (
  <span className={styles.etiqueta} style={{ "--etiqueta-fondo": fondo, "--etiqueta-color": color } as CSSProperties}>
    {texto}
  </span>
);
