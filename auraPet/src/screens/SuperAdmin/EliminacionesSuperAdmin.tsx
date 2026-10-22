import { useState } from "react";
import { COLUMNAS_SUPERADMIN, ESTADO_SOLICITUD_ELIMINACION, ESTILO_ROL, TEXTOS_ELIMINACION as T } from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { useAccion } from "../../hooks/useAccion";
import { getSolicitudesEliminacion } from "../../Api/getInfo";
import { resolverSolicitudEliminacion } from "../../Api/postInfo";
import { TablaPanel } from "../../components/ui/TablaPanel";
import { FilaTabla } from "../../components/ui/FilaTabla";
import { Etiqueta } from "../../components/ui/Etiqueta";
import { Aviso } from "../../components/ui/Aviso";
import { RechazarModal } from "../../Modal/ReachazarModal";
import type { AvisoEstado, SolicitudEliminacionListada } from "../../interfaces";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const COLUMNAS = COLUMNAS_SUPERADMIN.eliminaciones;

// Sección "Eliminaciones": cuentas que pidieron ser eliminadas.
// Desactivar impide ingresar; el historial médico se conserva (migración 32).
export const EliminacionesSuperAdmin = () => {
  const [recarga, setRecarga] = useState(0);
  const { datos: solicitudes = [], cargando, error } = useConsulta(() => getSolicitudesEliminacion(), [recarga]);
  const { ejecutar, ocupado, error: errorAccion } = useAccion();
  const [aRechazar, setARechazar] = useState<SolicitudEliminacionListada | null>(null);
  const [aviso, setAviso] = useState<AvisoEstado | null>(null);

  const resolver = async (s: SolicitudEliminacionListada, aprobar: boolean, respuesta?: string) => {
    setAviso(null);
    const ok = await ejecutar(() => resolverSolicitudEliminacion(s.id, aprobar, respuesta), "No se pudo resolver la solicitud.");
    if (ok) {
      setARechazar(null);
      setAviso({ tipo: "ok", texto: aprobar ? T.desactivada(s.nombre) : T.rechazadaOk(s.nombre) });
      setRecarga((n) => n + 1);
    }
  };

  const aprobar = (s: SolicitudEliminacionListada) => {
    if (window.confirm(T.confirmarAprobar(s.nombre))) resolver(s, true);
  };

  const pendientes = solicitudes.filter((s) => s.estado === "pendiente").length;

  return (
    <>
      <h1 className={styles.titulo}>{T.tituloSeccion}</h1>
      <p className={styles.subtitulo}>{T.subtituloSeccion}</p>
      {aviso && <Aviso {...aviso} onCerrar={() => setAviso(null)} />}
      {errorAccion && !aRechazar && <Aviso tipo="error" texto={errorAccion} />}
      {pendientes > 0 && <p className={styles.alerta}>{T.pendientes(pendientes)}</p>}

      <TablaPanel
        columnas={COLUMNAS}
        encabezados={["Cuenta", "Rol", "Motivo", "Pedida", "Estado", ""]}
        cargando={cargando}
        error={error}
        vacio={T.vacio}
        cantidad={solicitudes.length}
      >
        {solicitudes.map((s) => (
          <FilaTabla key={s.id} columnas={COLUMNAS} atenuada={ocupado}>
            <div className={styles.celdaDoble}>
              <span className={styles.fuerte}>{s.nombre}</span>
              <span className={`${styles.detalle} ${styles.recortado}`} title={s.correo}>{s.correo}</span>
            </div>
            <Etiqueta {...(ESTILO_ROL[s.rol] ?? ESTILO_ROL.dueno)} />
            <div className={styles.celdaDoble}>
              <span className={styles.motivo} title={s.motivo ?? undefined}>{s.motivo ?? "—"}</span>
              {s.respuesta && <span className={`${styles.detalle} ${styles.italica}`}>Respuesta: {s.respuesta}</span>}
            </div>
            <span className={styles.suave}>{s.fecha}</span>
            <Etiqueta {...ESTADO_SOLICITUD_ELIMINACION[s.estado]} />
            <div className={styles.acciones}>
              {s.estado === "pendiente" && (
                <>
                  <button type="button" className={styles.botonPrimario} disabled={ocupado} onClick={() => aprobar(s)}>
                    {T.aprobar}
                  </button>
                  <button type="button" className={styles.botonPeligro} disabled={ocupado} onClick={() => setARechazar(s)}>
                    {T.rechazar}
                  </button>
                </>
              )}
            </div>
          </FilaTabla>
        ))}
      </TablaPanel>

      {aRechazar && (
        <RechazarModal
          nombreSolicitud={`${aRechazar.nombre} · ${aRechazar.correo}`}
          titulo={T.tituloRechazo}
          descripcion={T.descripcionRechazo}
          ocupado={ocupado}
          onCancelar={() => setARechazar(null)}
          onConfirmar={(razon) => resolver(aRechazar, false, razon)}
        />
      )}
    </>
  );
};
