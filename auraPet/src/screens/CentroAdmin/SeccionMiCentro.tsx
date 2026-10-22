import { useState } from "react";
import { DIAS_SEMANA, DIAS_SEMANA_ORDEN, TEXTOS_CENTRO_ADMIN as T } from "../../constants";
import { getCentroDetalle } from "../../Api/getInfo";
import { useConsulta } from "../../hooks/useConsulta";
import { textoHorario } from "../../lib/centroAdmin";
import type { SeccionDeCentroProps } from "../../interfaces";
import { TarjetaCentro } from "../../components/centroAdmin/TarjetaCentro";
import { FormularioCentro } from "../../components/centroAdmin/FormularioCentro";
import styles from "../../css/centroAdmin/PanelCentro.module.css";

// Mi centro: datos editables + horarios + especialidades.
export const SeccionMiCentro = ({ centroId }: SeccionDeCentroProps) => {
  const [recarga, setRecarga] = useState(0);
  const { datos: centro, cargando, error } = useConsulta(() => getCentroDetalle(centroId), [centroId, recarga]);

  if (cargando && !centro) return <p className={styles.estado}>Cargando…</p>;
  if (error || !centro) return <p className={styles.error}>{error ?? "No se encontró el centro."}</p>;

  return (
    <>
      <h1 className={styles.titulo}>
        {centro.nombre}
        {centro.esPrueba && <span className={styles.marcaPrueba}>{T.centroPrueba}</span>}
      </h1>

      {/* key: si cambia el centro, el formulario se reinicia con sus datos */}
      <FormularioCentro key={centro.id} centro={centro} onGuardado={() => setRecarga((n) => n + 1)} />

      <TarjetaCentro titulo={T.horario}>
        {centro.horarios.length === 0 ? (
          <p className={styles.vacio}>{T.sinHorario}</p>
        ) : (
          <dl className={styles.horarios}>
            {DIAS_SEMANA_ORDEN.map((dia) => {
              const h = centro.horarios.find((x) => x.diaSemana === dia);
              return (
                <div key={dia} className={styles.horarioFila}>
                  <dt className={styles.fuerte}>{DIAS_SEMANA[dia]}</dt>
                  <dd className={h ? styles.horarioAbierto : styles.suave}>{h ? textoHorario(h) : T.cerrado}</dd>
                </div>
              );
            })}
          </dl>
        )}
      </TarjetaCentro>

      <TarjetaCentro titulo={T.especialidades}>
        {centro.especialidades.length === 0 ? (
          <p className={styles.vacio}>{T.sinEspecialidades}</p>
        ) : (
          <div className={styles.chips}>
            {centro.especialidades.map((e) => <span key={e} className={styles.chip}>{e}</span>)}
          </div>
        )}
      </TarjetaCentro>
    </>
  );
};
