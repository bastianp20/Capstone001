import { Iconos } from "../../constants";
import type { AcordeonProps } from "../../interfaces";
import styles from "../../css/ui/Acordeon.module.css";

// Preguntas y respuestas desplegables (<details>: accesible y sin estado propio).
export const Acordeon = ({ titulo, items }: AcordeonProps) => (
  <section className={styles.acordeon}>
    {titulo && <h2 className={styles.titulo}>{titulo}</h2>}
    {items.map((item) => (
      <details key={item.pregunta} className={styles.item}>
        <summary>
          {item.pregunta}
          <Iconos.flechaAbajo size={18} className={styles.flecha} aria-hidden="true" />
        </summary>
        <p>{item.respuesta}</p>
      </details>
    ))}
  </section>
);
