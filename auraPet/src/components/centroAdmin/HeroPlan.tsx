import type { CSSProperties } from "react";
import { ESTADO_SUSCRIPCION, TEXTOS_SUSCRIPCION } from "../../constants";
import { formatFechaLarga } from "../../lib/fechas";
import { precioPlan, progresoPrueba } from "../../lib/suscripcion";
import type { HeroPlanProps } from "../../interfaces";
import { Etiqueta } from "../ui/Etiqueta";
import styles from "../../css/centroAdmin/Suscripcion.module.css";

const T = TEXTOS_SUSCRIPCION;

// Tarjeta principal: el plan actual, su estado, el precio y (si está en prueba)
// cuántos días le quedan. Es el ÚNICO botón primario de "Mejorar plan".
export const HeroPlan = ({ suscripcion: s, planMejora, onMejorar }: HeroPlanProps) => {
  const prueba = s.estado === "prueba" && s.finPrueba ? progresoPrueba(s.inicio, s.finPrueba) : null;
  const solicitado = s.planSolicitado !== null;

  return (
    <section className={styles.hero}>
      <div className={styles.heroTexto}>
        <div className={styles.heroTitulo}>
          <h2>Plan {s.plan.nombre}</h2>
          <Etiqueta {...ESTADO_SUSCRIPCION[s.estado]} />
        </div>
        <p className={styles.heroPrecio}>
          {s.estado === "prueba" ? T.gratisPrueba : precioPlan(s.plan)}
        </p>

        {prueba && (
          <div className={styles.prueba}>
            <span className={styles.pruebaDia}>{T.diaDePrueba(prueba.dia, prueba.total)}</span>
            <div className={styles.barra} role="progressbar" aria-valuenow={prueba.dia} aria-valuemin={1} aria-valuemax={prueba.total}>
              <div className={styles.barraRelleno} style={{ "--progreso": `${(prueba.dia / prueba.total) * 100}%` } as CSSProperties} />
            </div>
            <span className={styles.heroNota}>{prueba.terminada ? T.pruebaTerminada : T.terminaPrueba(prueba.fechaFin)}</span>
          </div>
        )}
        {s.estado === "activa" && s.renovacion && <span className={styles.heroNota}>{T.renueva(formatFechaLarga(s.renovacion))}</span>}
      </div>

      {planMejora && (
        <button
          type="button"
          className={styles.botonPrimario}
          onClick={() => onMejorar(planMejora)}
          disabled={solicitado}
          title={solicitado ? T.enRevision : undefined}
        >
          {solicitado ? T.enRevision : T.mejorarPlan}
        </button>
      )}
    </section>
  );
};
