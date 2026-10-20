import { Badge, badgeStyles, COLUMNAS_SUPERADMIN, ESTADO_LABEL, ETIQUETA_PRUEBA, URGENCIA_LABEL } from "../../constants";
import type { TablaCitasProps } from "../../interfaces";
import { TablaPanel } from "../ui/TablaPanel";
import { FilaTabla } from "../ui/FilaTabla";
import { Etiqueta } from "../ui/Etiqueta";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const COLUMNAS = COLUMNAS_SUPERADMIN.citas;

// Tabla de citas (solo lectura). La usan el Resumen y la sección Citas.
export const TablaCitas = ({ citas, cargando, error, vacio, titulo, accion }: TablaCitasProps) => (
  <TablaPanel
    titulo={titulo}
    accion={accion}
    columnas={COLUMNAS}
    encabezados={["Mascota / Dueño", "Veterinario", "Centro", "Fecha/hora", "Estado", "Urgencia"]}
    cargando={cargando}
    error={error}
    vacio={vacio}
    cantidad={citas.length}
  >
    {citas.map((c) => (
      <FilaTabla key={c.id} columnas={COLUMNAS}>
        <div className={styles.celdaDoble}>
          <span className={styles.fuerte}>{c.mascota}</span>
          <span className={styles.detalle}>{c.dueno}</span>
        </div>
        <span className={styles.suave}>{c.veterinario}</span>
        <div className={styles.celdaDoble}>
          <span className={styles.suave}>{c.centro}</span>
          {c.esPrueba && <Etiqueta {...ETIQUETA_PRUEBA} />}
        </div>
        <span className={styles.suave}>{c.fechaHora}</span>
        <span style={Badge(badgeStyles[c.estado])}>{ESTADO_LABEL[c.estado]}</span>
        <span style={Badge(badgeStyles[c.urgencia])}>{URGENCIA_LABEL[c.urgencia]}</span>
      </FilaTabla>
    ))}
  </TablaPanel>
);
