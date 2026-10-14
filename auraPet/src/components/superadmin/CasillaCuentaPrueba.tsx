import styles from "../../css/modal/CrearProfesionalModal.module.css"; // mismo diseño que los modales de crear
import { TEXTO_CUENTA_PRUEBA } from "../../constants";
import type { CasillaCuentaPruebaProps } from "../../interfaces";

// esta es una casilla de verificacion que se aplicaría a los modales de todas las cuentas, la idea es que 
// si la cuenta realmente es de prueba se le aplique esta casilla y por ende se podría aplicar al centro de pruebas 
export const CasillaCuentaPrueba = ({ marcada, onCambiar }: CasillaCuentaPruebaProps) => (
  <label className={`${styles.check} ${styles.completo}`}>
    <input type="checkbox" checked={marcada} onChange={(e) => onCambiar(e.target.checked)} />
    <span>
      Cuenta de prueba
      <small className={styles.ayuda} style={{ display: "block" }}>{TEXTO_CUENTA_PRUEBA}</small>
    </span>
  </label>
);
