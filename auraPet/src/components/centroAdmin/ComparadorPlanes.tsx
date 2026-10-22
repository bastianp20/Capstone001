import { PLAN_RECOMENDADO, TEXTOS_SUSCRIPCION } from "../../constants";
import type { ComparadorPlanesProps } from "../../interfaces";
import { TarjetaPlan } from "./TarjetaPlan";
import styles from "../../css/centroAdmin/Suscripcion.module.css";

// Los 3 planes lado a lado. En celular se apilan y el recomendado va primero.
export const ComparadorPlanes = ({ planes, planActual, estadoActual, planSolicitado, onElegir }: ComparadorPlanesProps) => (
  <section>
    <h2 className={styles.seccionTitulo}>{TEXTOS_SUSCRIPCION.comparadorTitulo}</h2>
    <div className={styles.comparador}>
      {planes.map((plan) => (
        <TarjetaPlan
          key={plan.id}
          plan={plan}
          // En prueba del plan inicial, ese plan cuenta como "actual"
          esActual={plan.id === planActual && estadoActual !== "vencida" && estadoActual !== "cancelada"}
          esRecomendado={plan.id === PLAN_RECOMENDADO}
          solicitado={plan.id === planSolicitado}
          onElegir={() => onElegir(plan)}
        />
      ))}
    </div>
  </section>
);
