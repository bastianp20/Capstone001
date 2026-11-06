import { Iconos } from "../../constants";
import type { TarjetaProgresoProps } from "../../interfaces";
import styles from "../../css/ui/TarjetaProgreso.module.css";

// "Completa tu perfil": porcentaje, barra y los pasos que faltan, cada uno un
// botón que lleva a completarlo. Si no falta nada, no se muestra.
export const TarjetaProgreso = ({ titulo, porcentaje, textoPorcentaje, ayuda, pendientes, onElegir }: TarjetaProgresoProps) => {
  if (pendientes.length === 0) return null;
  return (
    <section className={styles.tarjeta} aria-label={titulo}>
      <div>
        <h2 className={styles.titulo}>{titulo}</h2>
        <p className={styles.porcentaje}>{textoPorcentaje}</p>
        <div className={styles.barra} role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.relleno} style={{ width: `${porcentaje}%` }} />
        </div>
        <p className={styles.ayuda}>{ayuda}</p>
      </div>
      <ul className={styles.pasos}>
        {pendientes.map(({ id, texto, Icono }) => (
          <li key={id}>
            <button type="button" className={styles.paso} onClick={() => onElegir(id)}>
              <Icono size={16} aria-hidden="true" />
              <span>{texto}</span>
              <Iconos.flechaDerecha size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
