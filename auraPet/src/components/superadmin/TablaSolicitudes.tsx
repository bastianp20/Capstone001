import { COLUMNAS_SUPERADMIN, TEXTOS_DETALLE_SOLICITUD, TEXTOS_SUPERADMIN, TIPO_SOLICITUD_LABEL } from "../../constants";
import type { TablaSolicitudesProps } from "../../interfaces";
import { TablaPanel } from "../ui/TablaPanel";
import { FilaTabla } from "../ui/FilaTabla";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const COLUMNAS = COLUMNAS_SUPERADMIN.solicitudes;

// Solicitudes pendientes con sus acciones. Las de "Quiere unirse" se
// revisan en detalle antes de aprobar; las demás se aprueban directo.
export const TablaSolicitudes = ({ solicitudes, cargando, titulo, accion, onAprobar, onRechazar, onVerDetalle }: TablaSolicitudesProps) => (
  <TablaPanel
    titulo={titulo}
    accion={accion}
    columnas={COLUMNAS}
    encabezados={["Solicitud", "Tipo", "Fecha de registro", "Acciones"]}
    cargando={cargando}
    vacio={TEXTOS_SUPERADMIN.sinPendientes}
    cantidad={solicitudes.length}
  >
    {solicitudes.map((s) => (
      <FilaTabla key={s.id} columnas={COLUMNAS}>
        <div className={styles.celdaDoble}>
          <span className={styles.fuerte}>{s.nombre}</span>
          {s.detalle && <span className={styles.detalle}>{s.detalle}</span>}
        </div>
        <span className={styles.suave}>{TIPO_SOLICITUD_LABEL[s.tipo]}</span>
        <span className={styles.suave}>{s.fechaRegistro}</span>
        <div className={styles.acciones}>
          {s.tipo === "solicitud_centro" ? (
            <button type="button" className={styles.botonPrimario} onClick={() => onVerDetalle(s)}>
              {TEXTOS_DETALLE_SOLICITUD.verDetalle}
            </button>
          ) : (
            <button type="button" className={styles.botonSuave} onClick={() => onAprobar(s)}>
              {TEXTOS_SUPERADMIN.aprobar}
            </button>
          )}
          <button type="button" className={styles.botonPeligro} onClick={() => onRechazar(s)}>
            {TEXTOS_SUPERADMIN.rechazar}
          </button>
        </div>
      </FilaTabla>
    ))}
  </TablaPanel>
);
