import { ETIQUETA_MIEMBRO, TEXTOS_CENTRO_ADMIN as T } from "../../constants";
import { getEquipoCentro } from "../../Api/getInfo";
import { useConsulta } from "../../hooks/useConsulta";
import type { SeccionDeCentroProps } from "../../interfaces";
import { Etiqueta } from "../../components/ui/Etiqueta";
import styles from "../../css/centroAdmin/PanelCentro.module.css";

// Equipo: veterinarios y administradores del centro.
export const SeccionEquipoCentro = ({ centroId }: SeccionDeCentroProps) => {
  const { datos: equipo = [], cargando, error } = useConsulta(() => getEquipoCentro(centroId), [centroId]);

  return (
    <>
      <h1 className={styles.titulo}>{T.tituloEquipo}</h1>
      <p className={styles.subtitulo}>{T.subtituloEquipo}</p>
      <section className={styles.tarjeta}>
        {cargando && <p className={styles.estado}>Cargando…</p>}
        {error && <p className={`${styles.estado} ${styles.error}`}>{error}</p>}
        {!cargando && !error && equipo.length === 0 && <p className={styles.estado}>{T.sinEquipo}</p>}
        <ul className={styles.listaEquipo}>
          {equipo.map((m, i) => (
            <li key={`${m.tipo}-${m.perfilId ?? i}`} className={styles.miembro}>
              <div className={styles.celdaDoble}>
                <span className={styles.fuerte}>{m.nombre}</span>
                <span className={styles.suave}>{m.detalle}</span>
              </div>
              <Etiqueta {...ETIQUETA_MIEMBRO[m.tipo]} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
