import { Iconos } from "../../constants";
import type { AvisoProps } from "../../interfaces";
import styles from "../../css/ui/Aviso.module.css";

// Franja de aviso: verde si salió bien, roja si hubo un error.
// Si se pasa onCerrar, muestra la X para cerrarlo.
export const Aviso = ({ tipo, texto, onCerrar }: AvisoProps) => (
  <div className={`${styles.aviso} ${styles[tipo]}`} role={tipo === "error" ? "alert" : "status"}>
    {tipo === "ok" ? <Iconos.completado size={16} aria-hidden="true" /> : <Iconos.urgenciaMedia size={16} aria-hidden="true" />}
    <span className={styles.texto}>{texto}</span>
    {onCerrar && (
      <button type="button" className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar aviso">
        <Iconos.cerrar size={14} />
      </button>
    )}
  </div>
);
