import { TEXTO_SIN_REGISTRAR } from "../../../constants";
import type { DatoFichaProps } from "../../../interfaces";
import styles from "../../../css/ficha/FichaPaciente.module.css";

// Un dato de la ficha: etiqueta chica arriba y valor abajo.
// Si el valor viene vacío se muestra "Sin registrar".
export const DatoFicha = ({ etiqueta, valor }: DatoFichaProps) => {
  const vacio = valor === null || valor === undefined || valor === "";
  return (
    <div className={styles.dato}>
      <span className={styles.datoEtiqueta}>{etiqueta}</span>
      <span className={vacio ? styles.datoVacio : styles.datoValor}>{vacio ? TEXTO_SIN_REGISTRAR : valor}</span>
    </div>
  );
};
