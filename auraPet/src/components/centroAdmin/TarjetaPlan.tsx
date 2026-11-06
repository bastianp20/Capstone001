import { DESCRIPCION_PLAN, FUNCIONES_PLANES, Iconos, TEXTOS_SUSCRIPCION } from "../../constants";
import { precioPlan } from "../../lib/suscripcion";
import type { TarjetaPlanProps } from "../../interfaces";
import styles from "../../css/centroAdmin/Suscripcion.module.css";

const T = TEXTOS_SUSCRIPCION;

// Una columna del comparador: nombre, precio, la misma lista de funciones
// que las otras (✓ / — / texto) y el botón al final.
export const TarjetaPlan = ({ plan, esActual, esRecomendado, solicitado, onElegir }: TarjetaPlanProps) => {
  const textoBoton = esActual ? T.planActual
    : solicitado ? T.enRevision
    : plan.id === "gestion" ? T.hablarVentas
    : T.elegir(plan.nombre);

  return (
    <article className={`${styles.plan} ${esRecomendado ? styles.planRecomendado : ""} ${esActual ? styles.planActual : ""}`}>
      {esRecomendado && (
        <span className={styles.cinta}><Iconos.destacado size={12} aria-hidden="true" /> {T.recomendado}</span>
      )}
      <header className={styles.planCabecera}>
        <h3>{plan.nombre}</h3>
        <p className={styles.planPrecio}>{precioPlan(plan)}</p>
        <p className={styles.planDescripcion}>{DESCRIPCION_PLAN[plan.id]}</p>
      </header>

      <ul className={styles.funciones}>
        {FUNCIONES_PLANES.map((f) => {
          const valor = f.valores[plan.id];
          return (
            <li key={f.texto} className={valor === false ? styles.funcionNo : undefined}>
              <span>{f.texto}</span>
              {typeof valor === "string" ? (
                <strong className={styles.funcionTexto}>{valor}</strong>
              ) : valor ? (
                <Iconos.check size={16} className={styles.funcionSi} aria-label="Incluido" />
              ) : (
                <span aria-label="No incluido">—</span>
              )}
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={esRecomendado && !esActual && !solicitado ? styles.botonPrimario : styles.botonSecundario}
        onClick={onElegir}
        disabled={esActual || solicitado}
      >
        {textoBoton}
      </button>
    </article>
  );
};
