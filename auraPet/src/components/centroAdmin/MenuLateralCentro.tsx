import { Iconos, MENU_CENTRO_ADMIN, TEXTOS_CENTRO_ADMIN as T } from "../../constants";
import type { MenuLateralCentroProps } from "../../interfaces";
import { ItemMenuDarEnAdopcion } from "../adopcion/ItemMenuDarEnAdopcion";
import LogoAuraPetSinFondo from "../../assets/logo/LogoAuraPetSinFondo.png";
import styles from "../../css/superadmin/SuperAdminLayout.module.css";
import propios from "../../css/centroAdmin/PanelCentro.module.css";

// Menú lateral del panel del centro (mismo estilo que el del superadmin).
export const MenuLateralCentro = ({ seccion, onCambiar, onVolver, onConfiguracion, onDarEnAdopcion }: MenuLateralCentroProps) => (
  <aside className={styles.sidebar}>
    <div className={styles.marca}>
      <img src={LogoAuraPetSinFondo} alt="" className={styles.logo} />
      <span>AuraPet</span>
    </div>

    <nav className={styles.menu} aria-label="Secciones del centro">
      {MENU_CENTRO_ADMIN.map(({ seccion: s, texto, icono: Icono }) => (
        <button key={s} type="button"
          className={`${styles.itemMenu} ${s === seccion ? styles.itemMenuActivo : ""}`}
          aria-current={s === seccion ? "page" : undefined}
          onClick={() => onCambiar(s)}>
          <Icono size={17} aria-hidden="true" />
          <span className={styles.itemMenuTexto}>{texto}</span>
        </button>
      ))}
    </nav>

    <div className={propios.menuPie}>
      <ItemMenuDarEnAdopcion className={styles.itemMenu} claseTexto={styles.itemMenuTexto} onClick={onDarEnAdopcion} />
      {onVolver && (
        <button type="button" className={styles.itemMenu} onClick={onVolver}>
          <Iconos.calendario size={17} aria-hidden="true" />
          <span className={styles.itemMenuTexto}>{T.volverAgenda}</span>
        </button>
      )}
      <button type="button" className={styles.itemMenu} onClick={onConfiguracion}>
        <Iconos.configuracion size={17} aria-hidden="true" />
        <span className={styles.itemMenuTexto}>{T.configuracion}</span>
      </button>
    </div>
  </aside>
);
