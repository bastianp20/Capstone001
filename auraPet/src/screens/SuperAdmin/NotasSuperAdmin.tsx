import { TEXTOS_NOTAS as T } from "../../constants";
import { PanelNotas } from "../../components/notas/PanelNotas";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

// Sección "Notas" del superadmin: su libreta personal.
export const NotasSuperAdmin = () => (
  <>
    <h1 className={styles.titulo}>{T.titulo}</h1>
    <PanelNotas descripcion={T.descripcionSuperadmin} />
  </>
);
