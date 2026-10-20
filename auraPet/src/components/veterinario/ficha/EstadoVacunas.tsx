import { ESTADO_VACUNA } from "../../../constants";
import type { EstadoVacunasProps } from "../../../interfaces";
import styles from "../../../css/ficha/FichaPaciente.module.css";

// Vacunas con próxima dosis y si están al día, por vencer o vencidas.
export const EstadoVacunas = ({ vacunas }: EstadoVacunasProps) => (
  <section className={styles.seccion}>
    <h4 className={styles.seccionTitulo}>Vacunas</h4>
    {vacunas.length === 0 ? (
      <p className={styles.vacio}>Sin vacunas con próxima dosis registrada.</p>
    ) : (
      <div>
        {vacunas.map((v) => {
          const estilo = ESTADO_VACUNA[v.estado];
          return (
            <div key={v.registroId} className={styles.vacuna}>
              <span>
                {v.nombre}
                <span className={styles.vacunaFechas}>Aplicada {v.aplicada} · Próxima {v.proximaDosis}</span>
              </span>
              <span className={styles.chip} style={{ background: estilo.fondo, color: estilo.color }}>{estilo.texto}</span>
            </div>
          );
        })}
      </div>
    )}
  </section>
);
