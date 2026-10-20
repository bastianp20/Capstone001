import { Badge, badgeStyles, ESTADO_LABEL, TEXTOS_DETALLE_USUARIO } from "../../../constants";
import type { ListaCitasUsuarioProps } from "../../../interfaces";
import styles from "../../../css/superadmin/DetalleModal.module.css";

// Últimas citas: fecha, mascota, una línea de detalle y el estado
export const ListaCitasUsuario = ({ citas }: ListaCitasUsuarioProps) =>
  citas.length === 0 ? (
    <p className={styles.vacio}>{TEXTOS_DETALLE_USUARIO.sinCitas}</p>
  ) : (
    <ul className={styles.lista}>
      {citas.map((c) => (
        <li key={c.id} className={styles.filaCita}>
          <span className={styles.fechaCita}>{c.fecha}</span>
          <span className={styles.textoCita}>
            <strong>{c.mascota}</strong>
            <span className={styles.suave}>{c.detalle}</span>
          </span>
          <span style={Badge(badgeStyles[c.estado])}>{ESTADO_LABEL[c.estado]}</span>
        </li>
      ))}
    </ul>
  );
