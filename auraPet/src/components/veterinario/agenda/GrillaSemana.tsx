import { Fragment } from "react";
import { TEXTOS_MI_AGENDA as T } from "../../../constants";
import { claveCelda } from "../../../lib/agendaSemana";
import type { GrillaSemanaProps } from "../../../interfaces";
import { CeldaAgendaBoton } from "./CeldaAgendaBoton";
import styles from "../../../css/veterinario/MiAgenda.module.css";

// La semana como grilla: una columna por día y una fila por hora.
// Las casillas sin celda son horas en que ese día no atiende.
export const GrillaSemana = ({ semana, onElegirCelda }: GrillaSemanaProps) => {
  if (semana.horas.length === 0) return <p className={styles.vacio}>{T.sinHoras}</p>;

  return (
    <div className={styles.contenedorGrilla}>
      <div className={styles.grilla} role="grid" aria-label={T.titulo}>
        <div className={styles.encabezadoHora} role="columnheader">{T.hora}</div>
        {semana.dias.map((d) => (
          <div key={d.fecha} role="columnheader" className={`${styles.encabezadoDia} ${d.esHoy ? styles.diaHoy : ""}`}
            aria-current={d.esHoy ? "date" : undefined}>
            {d.titulo}
          </div>
        ))}

        {semana.horas.map((hora) => (
          <Fragment key={hora}>
            <div className={styles.hora} role="rowheader">{hora}</div>
            {semana.dias.map((d) => (
              <div key={d.fecha} className={styles.casilla} role="gridcell">
                <CeldaAgendaBoton celda={semana.celdas[claveCelda(d.fecha, hora)]} onElegir={onElegirCelda} />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
