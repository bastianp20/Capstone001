import type { ResumenActividadProps } from "../../../interfaces";
import styles from "../../../css/superadmin/DetalleModal.module.css";

// Fila de números grandes con su etiqueta ("12 Citas", "3 Próximas"...).
// La usan el detalle de usuario y el de centro.
export const ResumenActividad = ({ numeros }: ResumenActividadProps) => (
  <div className={styles.numeros}>
    {numeros.map((n) => (
      <div key={n.texto} className={styles.numero}>
        <strong>{n.valor}</strong>
        <span>{n.texto}</span>
      </div>
    ))}
  </div>
);
