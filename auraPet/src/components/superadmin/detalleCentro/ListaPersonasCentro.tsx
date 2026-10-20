import type { ListaPersonasCentroProps } from "../../../interfaces";
import { Etiqueta } from "../../ui/Etiqueta";
import styles from "../../../css/superadmin/DetalleModal.module.css";

// Personas del centro (administradores o veterinarios) con una etiqueta opcional
export const ListaPersonasCentro = ({ personas, vacio }: ListaPersonasCentroProps) =>
  personas.length === 0 ? (
    <p className={styles.vacio}>{vacio}</p>
  ) : (
    <div>
      {personas.map((p) => (
        <div key={p.id} className={styles.persona}>
          <span className={styles.personaTexto}>
            <strong>{p.nombre}</strong>
            <span className={styles.suave}>{p.detalle}</span>
          </span>
          {p.etiqueta && <Etiqueta {...p.etiqueta} />}
        </div>
      ))}
    </div>
  );
