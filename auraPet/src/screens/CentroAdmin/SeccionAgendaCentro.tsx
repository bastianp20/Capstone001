import { COLUMNAS_CITAS_CENTRO, ESTADO_LABEL, TEXTOS_CENTRO_ADMIN as T, URGENCIA_LABEL } from "../../constants";
import { getCitasCentro } from "../../Api/getInfo";
import { useConsulta } from "../../hooks/useConsulta";
import type { SeccionDeCentroProps } from "../../interfaces";
import { TablaPanel } from "../../components/ui/TablaPanel";
import { FilaTabla } from "../../components/ui/FilaTabla";
import { EtiquetaCita } from "../../components/ui/EtiquetaCita";
import styles from "../../css/centroAdmin/PanelCentro.module.css";

// Agenda del centro: todas sus citas.
export const SeccionAgendaCentro = ({ centroId }: SeccionDeCentroProps) => {
  const { datos: citas = [], cargando, error } = useConsulta(() => getCitasCentro(centroId), [centroId]);

  return (
    <>
      <h1 className={styles.titulo}>{T.tituloAgenda}</h1>
      <p className={styles.subtitulo}>{T.subtituloAgenda}</p>
      <TablaPanel
        columnas={COLUMNAS_CITAS_CENTRO}
        encabezados={["Mascota / Dueño", "Veterinario", "Motivo", "Fecha/Hora", "Estado", "Urgencia"]}
        cargando={cargando}
        error={error}
        vacio={T.sinCitas}
        cantidad={citas.length}
      >
        {citas.map((c) => (
          <FilaTabla key={c.id} columnas={COLUMNAS_CITAS_CENTRO}>
            <div className={styles.celdaDoble}>
              <span className={styles.fuerte}>{c.mascota}</span>
              <span className={styles.suave}>{c.dueno}</span>
            </div>
            <span className={styles.suave}>{c.veterinario}</span>
            <span className={styles.suave}>{c.motivo}</span>
            <span className={styles.suave}>{c.fechaHora}</span>
            <EtiquetaCita valor={c.estado} texto={ESTADO_LABEL[c.estado]} />
            <EtiquetaCita valor={c.urgencia} texto={URGENCIA_LABEL[c.urgencia]} />
          </FilaTabla>
        ))}
      </TablaPanel>
    </>
  );
};
