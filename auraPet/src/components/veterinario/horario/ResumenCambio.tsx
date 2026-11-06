import { Iconos, TEXTOS_MI_HORARIO as T } from "../../../constants";
import type { ResumenCambioProps } from "../../../interfaces";
import base from "../../../css/modal/RechazarModal.module.css";
import styles from "../../../css/modal/CambioHorario.module.css";

// Pantalla final de los modales de Mi horario: qué cambió y a quién avisamos.
export const ResumenCambio = ({ titulo, detalle, onCerrar }: ResumenCambioProps) => (
  <div className={styles.listo} role="status">
    <span className={styles.listoIcono} aria-hidden="true"><Iconos.check size={28} /></span>
    <h3 className={styles.listoTitulo}>{titulo}</h3>
    <p className={styles.listoDetalle}>{detalle}</p>
    <button type="button" className={`${base.boton} ${styles.botonPrincipal}`} onClick={onCerrar} autoFocus>
      {T.cerrar}
    </button>
  </div>
);
