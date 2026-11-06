import { DIAS_SEMANA, TEXTOS_HORARIO_ATENCION as T } from "../../../constants";
import type { TarjetaLugarHorarioProps } from "../../../interfaces";
import { esDiaCompleto } from "../../../lib/centroAdmin";
import styles from "../../../css/veterinario/HorarioAtencion.module.css";

// Los 7 días de un lugar (un centro o la atención independiente): cada día se
// marca y se le pone desde-hasta. Al lado, el horario del centro como ayuda.
export const TarjetaLugarHorario = ({ lugar, dias, onCambiarDia, onUsarHorarioCentro, deshabilitado }: TarjetaLugarHorarioProps) => {
  const conHorarioCentro = lugar.horarioCentro.length > 0;
  const nombre = lugar.nombre ?? T.independiente;

  return (
    <section className={styles.tarjeta} aria-label={nombre}>
      <div className={styles.tarjetaEncabezado}>
        <h2 className={styles.tarjetaTitulo}>{nombre}</h2>
        {conHorarioCentro && (
          <button type="button" className={styles.botonSecundario} onClick={onUsarHorarioCentro} disabled={deshabilitado}>
            {T.usarHorarioCentro}
          </button>
        )}
      </div>

      <div className={styles.dias}>
        {dias.map((d, i) => {
          const nombreDia = DIAS_SEMANA[i + 1];
          const delCentro = lugar.horarioCentro.find((h) => h.diaSemana === i + 1);
          return (
            <div key={nombreDia} className={styles.dia}>
              <label className={styles.casilla}>
                <input type="checkbox" checked={d.activo} disabled={deshabilitado}
                  onChange={(e) => onCambiarDia(i, { activo: e.target.checked })} />
                {nombreDia}
              </label>
              <label className={styles.campoHora}>
                {T.desde}
                <input type="time" className={styles.input} step={900} value={d.desde} disabled={deshabilitado || !d.activo}
                  onChange={(e) => onCambiarDia(i, { desde: e.target.value })} />
              </label>
              <label className={styles.campoHora}>
                {T.hasta}
                <input type="time" className={styles.input} step={900} value={d.hasta} disabled={deshabilitado || !d.activo}
                  onChange={(e) => onCambiarDia(i, { hasta: e.target.value })} />
              </label>
              {conHorarioCentro && (
                <span className={styles.notaCentro}>
                  {!delCentro ? T.centroCerrado
                    : esDiaCompleto(delCentro) ? T.centro24h : T.centroAtiende(delCentro.abre, delCentro.cierra)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
