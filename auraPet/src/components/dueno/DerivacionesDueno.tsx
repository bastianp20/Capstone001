import { TEXTOS_DERIVACION as T } from "../../constants";
import type { DerivacionesDuenoProps } from "../../interfaces";
import { TarjetaDerivacion } from "../derivaciones/TarjetaDerivacion";
import styles from "../../css/ficha/Derivaciones.module.css";

// Panel del dueño con las derivaciones de sus mascotas (solo lectura).
// No se muestra si no hay ninguna.
export const DerivacionesDueno = ({ derivaciones }: DerivacionesDuenoProps) => {
  if (derivaciones.length === 0) return null;
  return (
    <section className={`dueno-panel ${styles.panelDueno}`}>
      <div className="dueno-panel-header">{T.tituloDueno}</div>
      <div className={styles.cuerpoDueno}>
        <p className={styles.subtituloDueno}>{T.subtituloDueno}</p>
        <ul className={styles.lista}>
          {derivaciones.map((d) => <TarjetaDerivacion key={d.id} derivacion={d} mostrarMascota />)}
        </ul>
      </div>
    </section>
  );
};
