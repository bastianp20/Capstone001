import type { ListaCentrosUsuarioProps } from "../../../interfaces";
import styles from "../../../css/superadmin/DetalleModal.module.css";

// Centros como chips ("Clínica X · Ñuñoa"), marcando los de prueba
export const ListaCentrosUsuario = ({ centros, vacio }: ListaCentrosUsuarioProps) =>
  centros.length === 0 ? (
    <p className={styles.vacio}>{vacio}</p>
  ) : (
    <div className={styles.chips}>
      {centros.map((c) => (
        <span key={c.id} className={styles.chip}>
          {c.nombre}
          <span className={styles.chipDetalle}>· {c.comuna}</span>
          {c.esPrueba && <span className={styles.chipPrueba}>prueba</span>}
        </span>
      ))}
    </div>
  );
