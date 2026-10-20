import { SEXO_LABEL, TEXTOS_DETALLE_USUARIO } from "../../../constants";
import type { ListaMascotasUsuarioProps } from "../../../interfaces";
import styles from "../../../css/superadmin/DetalleModal.module.css";

// Mascotas del dueño: nombre, especie, raza, sexo y edad
export const ListaMascotasUsuario = ({ mascotas }: ListaMascotasUsuarioProps) =>
  mascotas.length === 0 ? (
    <p className={styles.vacio}>{TEXTOS_DETALLE_USUARIO.sinMascotas}</p>
  ) : (
    <ul className={styles.lista}>
      {mascotas.map((m) => (
        <li key={m.id} className={styles.filaLista}>
          <strong>{m.nombre}</strong>
          <span className={styles.suave}>
            {[m.especie, m.raza, SEXO_LABEL[m.sexo], m.edad].filter(Boolean).join(" · ")}
          </span>
        </li>
      ))}
    </ul>
  );
