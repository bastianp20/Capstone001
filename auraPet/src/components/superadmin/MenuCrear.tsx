import { useState } from "react";
import { Iconos, OPCIONES_CREAR_SUPERADMIN, TEXTOS_SUPERADMIN } from "../../constants";
import type { MenuCrearProps } from "../../interfaces";
import { useTeclaEscape } from "../../hooks/useTeclaEscape";
import styles from "../../css/superadmin/SuperAdminLayout.module.css";

// Botón "+ Crear" con su menú desplegable (cuentas y centros)
export const MenuCrear = ({ onElegir }: MenuCrearProps) => {
  const [abierto, setAbierto] = useState(false);
  useTeclaEscape(() => setAbierto(false), abierto);

  return (
    <div className={styles.crear}>
      <button type="button" className={styles.botonCrear} onClick={() => setAbierto((a) => !a)} aria-expanded={abierto} aria-haspopup="menu">
        <Iconos.agregar size={16} aria-hidden="true" />
        {TEXTOS_SUPERADMIN.crear}
        <Iconos.flechaAbajo size={15} aria-hidden="true" />
      </button>

      {abierto && (
        <>
          {/* Capa invisible: un clic fuera del menú lo cierra */}
          <div className={styles.capaCierre} onClick={() => setAbierto(false)} />
          <div className={styles.menuCrear} role="menu">
            {OPCIONES_CREAR_SUPERADMIN.map(({ tipo, texto, icono: Icono }) => (
              <button
                key={tipo}
                type="button"
                role="menuitem"
                className={styles.opcionCrear}
                onClick={() => { setAbierto(false); onElegir(tipo); }}
              >
                <Icono size={17} aria-hidden="true" />
                {texto}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
