import { TEXTOS_HORARIO_CENTRO as T } from "../../../constants";
import type { FilasHorarioCentroProps } from "../../../interfaces";
import styles from "../../../css/centroAdmin/UrgenciasCentro.module.css";

// Los 7 días del horario del centro: si abre, a qué hora abre y cierra, y la
// colación opcional.
export const FilasHorarioCentro = ({ dias, onCambiarDia, deshabilitado }: FilasHorarioCentroProps) => (
  <div className={styles.dias}>
    {dias.map((d) => {
      const cerrado = deshabilitado || !d.atiende;
      return (
        <div key={d.dia} className={styles.dia}>
          <label className={styles.casilla}>
            <input type="checkbox" checked={d.atiende} disabled={deshabilitado}
              onChange={(e) => onCambiarDia(d.dia, { atiende: e.target.checked })} />
            {d.nombre}
          </label>
          <label className={styles.campoHora}>
            {T.desde}
            <input type="time" className={styles.input} step={900} value={d.abre} disabled={cerrado}
              onChange={(e) => onCambiarDia(d.dia, { abre: e.target.value })} />
          </label>
          <label className={styles.campoHora}>
            {T.hasta}
            <input type="time" className={styles.input} step={900} value={d.cierra} disabled={cerrado}
              onChange={(e) => onCambiarDia(d.dia, { cierra: e.target.value })} />
          </label>
          <label className={`${styles.casilla} ${styles.casillaColacion}`}>
            <input type="checkbox" checked={d.conColacion} disabled={cerrado}
              onChange={(e) => onCambiarDia(d.dia, { conColacion: e.target.checked })} />
            {T.colacion}
          </label>
          <label className={styles.campoHora}>
            {T.inicioColacion}
            <input type="time" className={styles.input} step={900} value={d.inicioColacion} disabled={cerrado || !d.conColacion}
              onChange={(e) => onCambiarDia(d.dia, { inicioColacion: e.target.value })} />
          </label>
          <label className={styles.campoHora}>
            {T.finColacion}
            <input type="time" className={styles.input} step={900} value={d.finColacion} disabled={cerrado || !d.conColacion}
              onChange={(e) => onCambiarDia(d.dia, { finColacion: e.target.value })} />
          </label>
        </div>
      );
    })}
  </div>
);
