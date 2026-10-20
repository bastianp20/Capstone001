import { TEXTOS_SUSCRIPCION } from "../../constants";
import type { UsoPlanProps } from "../../interfaces";
import { BarraUso } from "./BarraUso";
import styles from "../../css/centroAdmin/Suscripcion.module.css";

const T = TEXTOS_SUSCRIPCION;

// Uso real del centro. Solo lo que tiene límite va como barra;
// lo que no, como dato simple (sin porcentajes que no significan nada).
export const UsoPlan = ({ suscripcion: s, planMejora, onMejorar }: UsoPlanProps) => {
  const limite = s.plan.limiteVeterinarios;
  const enLimite = limite !== null && s.veterinarios >= limite;

  return (
    <section className={styles.tarjeta}>
      <h2 className={styles.tarjetaTitulo}>{T.usoTitulo}</h2>
      <div className={styles.usoGrilla}>
        <div>
          {limite !== null ? (
            <BarraUso etiqueta="Veterinarios" usado={s.veterinarios} limite={limite} />
          ) : (
            <div className={styles.dato}>
              <span className={styles.usoEtiqueta}>Veterinarios</span>
              <strong>{s.veterinarios} · {T.ilimitado.toLowerCase()}</strong>
            </div>
          )}
          {enLimite && (
            <p className={styles.alertaLimite}>
              {T.limiteAlcanzado}
              {planMejora && !s.planSolicitado && (
                <button type="button" className={styles.link} onClick={() => onMejorar(planMejora)}>
                  {T.mejorarParaAgregar}
                </button>
              )}
            </p>
          )}
        </div>
        <div className={styles.dato}>
          <span className={styles.usoEtiqueta}>Citas</span>
          <strong>{T.citasMes(s.citasMes)}</strong>
          <span className={styles.heroNota}>{T.sinLimiteCitas}</span>
        </div>
      </div>
    </section>
  );
};
