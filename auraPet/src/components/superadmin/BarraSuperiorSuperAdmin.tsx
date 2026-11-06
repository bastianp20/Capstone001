import { Iconos, TEXTOS_SUPERADMIN } from "../../constants";
import type { BarraSuperiorSuperAdminProps } from "../../interfaces";
import { MenuCrear } from "./MenuCrear";
import styles from "../../css/superadmin/SuperAdminLayout.module.css";
import { FotoPerfil } from "../perfil/FotoPerfil";

// Barra de arriba: "+ Crear", campana (con las solicitudes pendientes),
// configuración y la persona conectada.
export const BarraSuperiorSuperAdmin = ({ nombre, avatarUrl, pendientes, onCrear, onNotificaciones, onConfiguracion }: BarraSuperiorSuperAdminProps) => (
  <header className={styles.topbar}>
    <MenuCrear onElegir={onCrear} />

    {/* Sin pendientes: ícono gris. Con pendientes: píldora ámbar con campana + número al lado */}
    <button
      type="button"
      className={pendientes > 0 ? styles.campanaActiva : styles.botonIcono}
      onClick={onNotificaciones}
      aria-label={`${TEXTOS_SUPERADMIN.notificaciones}: ${pendientes}`}
      title={TEXTOS_SUPERADMIN.notificaciones}
    >
      <Iconos.notificaciones size={17} aria-hidden="true" />
      {pendientes > 0 && <span className={styles.campanaNumero}>{pendientes > 99 ? "99+" : pendientes}</span>}
    </button>

    <button type="button" className={styles.botonIcono} onClick={onConfiguracion} aria-label={TEXTOS_SUPERADMIN.configuracion} title={TEXTOS_SUPERADMIN.configuracion}>
      <Iconos.configuracion size={18} />
    </button>

    <div className={styles.usuario}>
      <FotoPerfil nombre={nombre} url={avatarUrl} className={styles.avatar} />
      <span className={styles.nombreUsuario}>{nombre}</span>
    </div>
  </header>
);
