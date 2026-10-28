import { MENU_SUPERADMIN } from "../../constants";
import type { MenuLateralSuperAdminProps } from "../../interfaces";
import { filtrarMenuRefugio } from "../../lib/refugios";
import { ItemMenuDarEnAdopcion } from "../adopcion/ItemMenuDarEnAdopcion";
import propios from "../../css/centroAdmin/PanelCentro.module.css";
import LogoAuraPetSinFondo from "../../assets/logo/LogoAuraPetSinFondo.png";
import styles from "../../css/superadmin/SuperAdminLayout.module.css";

// Menú lateral del superadmin. "Aprobaciones" muestra cuántas hay pendientes.
export const MenuLateralSuperAdmin = ({ seccion, pendientes, onCambiar, onDarEnAdopcion, conRefugio }: MenuLateralSuperAdminProps) => (
  <aside className={styles.sidebar}>
    <div className={styles.marca}>
      <img src={LogoAuraPetSinFondo} alt="" className={styles.logo} />
      <span>AuraPet</span>
    </div>

    <nav className={styles.menu} aria-label="Secciones del panel">
      {filtrarMenuRefugio(MENU_SUPERADMIN, (i) => i.seccion, conRefugio).map(({ seccion: s, texto, icono: Icono }) => (
        <button
          key={s}
          type="button"
          className={`${styles.itemMenu} ${s === seccion ? styles.itemMenuActivo : ""}`}
          aria-current={s === seccion ? "page" : undefined}
          onClick={() => onCambiar(s)}
        >
          <Icono size={17} aria-hidden="true" />
          <span className={styles.itemMenuTexto}>{texto}</span>
          {s === "aprobaciones" && pendientes > 0 && <span className={styles.contador}>{pendientes}</span>}
        </button>
      ))}
    </nav>

    <div className={propios.menuPie}>
      <ItemMenuDarEnAdopcion className={styles.itemMenu} claseTexto={styles.itemMenuTexto} onClick={onDarEnAdopcion} />
    </div>
  </aside>
);
