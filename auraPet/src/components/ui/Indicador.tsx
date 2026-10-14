import styles from "../../css/ui/Panel.module.css";
import type { IndicadorProps } from "../../interfaces";

// Indicador compacto: etiqueta, número grande y, si se pasa "progreso",
// una barrita de avance debajo (por ejemplo "Atendidas 2 de 6").
export const Indicador = ({ etiqueta, valor, tono = "normal", progreso }: IndicadorProps) => (
  <div className={styles.indicador}>
    <span className={styles.indicadorEtiqueta}>{etiqueta}</span>
    <span className={`${styles.indicadorValor} ${tono === "alerta" ? styles.indicadorAlerta : ""}`}>{valor}</span>
    {progreso !== undefined && (
      <div className={styles.progreso} role="progressbar" aria-valuenow={Math.round(progreso * 100)} aria-valuemin={0} aria-valuemax={100}>
        {/* Math.min/max: nunca menos de 0% ni más de 100% */}
        <div className={styles.progresoRelleno} style={{ width: `${Math.min(1, Math.max(0, progreso)) * 100}%` }} />
      </div>
    )}
  </div>
);
