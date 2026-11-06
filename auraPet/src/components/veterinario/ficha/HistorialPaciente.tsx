import { TIPO_REGISTRO_LABEL } from "../../../constants";
import { formatFechaLarga } from "../../../lib/fechas";
import type { HistorialPacienteProps } from "../../../interfaces";
import styles from "../../../css/ficha/FichaPaciente.module.css";

// Línea de tiempo con todo el historial médico (de cualquier veterinario/centro).
export const HistorialPaciente = ({ registros }: HistorialPacienteProps) => (
  <section className={styles.seccion}>
    <h4 className={styles.seccionTitulo}>Historial médico</h4>
    {registros.length === 0 ? (
      <p className={styles.vacio}>Todavía no hay registros médicos.</p>
    ) : (
      <ol className={styles.historial}>
        {registros.map((r) => (
          <li key={r.id} className={styles.registro}>
            <div className={styles.registroCabecera}>
              <span className={styles.tipo}>{TIPO_REGISTRO_LABEL[r.tipo]}</span>
              <span className={styles.fecha}>{r.fecha}</span>
            </div>
            <span>{r.descripcion}</span>
            {r.tratamiento && <span className={styles.textoSuave}>Tratamiento: {r.tratamiento}</span>}
            {r.proximaDosis && <span className={styles.textoSuave}>Próxima dosis: {formatFechaLarga(r.proximaDosis)}</span>}
            <span className={styles.autor}>
              {r.esMio ? "Registrado por ti" : r.veterinario ?? "Veterinario no informado"}
              {r.centro && ` · ${r.centro}`}
            </span>
          </li>
        ))}
      </ol>
    )}
  </section>
);
