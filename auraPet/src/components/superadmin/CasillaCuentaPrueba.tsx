import styles from "../../css/modal/CrearProfesionalModal.module.css"; // mismo diseño que los modales de crear
import propias from "../../css/superadmin/CuentasSuperAdmin.module.css";
import { TEXTO_CUENTA_PRUEBA } from "../../constants";
import type { CasillaCuentaPruebaProps } from "../../interfaces";

// esta es una casilla de verificacion que se aplicaría a los modales de todas las cuentas, la idea es que 
// si la cuenta realmente es de prueba se le aplique esta casilla y por ende se podría aplicar al centro de pruebas 
// titulo y ayuda permiten reusarla para centros ("Centro de prueba").
export const CasillaCuentaPrueba = ({
  marcada, onCambiar, titulo = "Cuenta de prueba", ayuda = TEXTO_CUENTA_PRUEBA,
}: CasillaCuentaPruebaProps) => (
  <label className={`${styles.check} ${styles.completo}`}>
    <input type="checkbox" checked={marcada} onChange={(e) => onCambiar(e.target.checked)} />
    <span>
      {titulo}
      <small className={`${styles.ayuda} ${propias.ayudaBloque}`}>{ayuda}</small>
    </span>
  </label>
);
