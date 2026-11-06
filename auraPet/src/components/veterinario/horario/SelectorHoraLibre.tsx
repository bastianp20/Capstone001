import { TEXTOS_MI_AGENDA as T } from "../../../constants";
import { agruparPorDia } from "../../../lib/agendaSemana";
import type { SelectorHoraLibreProps } from "../../../interfaces";
import styles from "../../../css/modal/CambioHorario.module.css";

// Horas libres del veterinario agrupadas por día, como chips (para reagendar).
export const SelectorHoraLibre = ({ horas, elegida, onElegir, deshabilitado }: SelectorHoraLibreProps) => (
  <div className={styles.grupo}>
    <span className={styles.etiqueta}>{T.horasLibres}</span>
    <div className={styles.listaHoras}>
      {agruparPorDia(horas).map((grupo) => (
        <div key={grupo.fecha} className={styles.grupoDia}>
          <span className={styles.tituloDia}>{grupo.titulo}</span>
          <div className={styles.chips}>
            {grupo.horas.map((h) => (
              <button key={h.inicio} type="button" disabled={deshabilitado} aria-pressed={elegida === h.inicio}
                className={`${styles.chip} ${elegida === h.inicio ? styles.chipActivo : ""}`}
                onClick={() => onElegir(h)}>
                {h.hora}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
