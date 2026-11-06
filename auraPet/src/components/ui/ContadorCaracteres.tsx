import type { ContadorCaracteresProps } from "../../interfaces";
import styles from "../../css/ui/ContadorCaracteres.module.css";

// "123 / 500" bajo un textarea. Se pone ámbar al acercarse al límite.
export const ContadorCaracteres = ({ actual, maximo }: ContadorCaracteresProps) => {
  const cercaDelLimite = actual >= maximo * 0.9;
  return (
    <span className={`${styles.contador} ${cercaDelLimite ? styles.contadorAlerta : ""}`} aria-live="polite">
      {actual} / {maximo}
    </span>
  );
};
