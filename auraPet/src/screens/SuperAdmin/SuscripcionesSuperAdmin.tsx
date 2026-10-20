import { useState } from "react";
import {
  COLUMNAS_SUPERADMIN, DIAS_EXTENSION_SUSCRIPCION, ESTADO_SUSCRIPCION, ETIQUETA_PRUEBA, FILTROS_SUSCRIPCIONES,
  MESES_ACTIVACION_PLAN, PREDICADOS_FILTRO_SUSCRIPCIONES, TEXTOS_SUSCRIPCIONES as T,
} from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { useFiltro } from "../../hooks/useFiltro";
import { useAccion } from "../../hooks/useAccion";
import { getSuscripcionesSuperadmin } from "../../Api/getInfo";
import { extenderSuscripcion, resolverSolicitudPlan } from "../../Api/postInfo";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import { TablaPanel } from "../../components/ui/TablaPanel";
import { FilaTabla } from "../../components/ui/FilaTabla";
import { Etiqueta } from "../../components/ui/Etiqueta";
import { Aviso } from "../../components/ui/Aviso";
import type { AvisoEstado, FiltroSuscripciones, SuscripcionListada } from "../../interfaces";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const COLUMNAS = COLUMNAS_SUPERADMIN.suscripciones;
const camposSuscripcion = (s: SuscripcionListada) => [s.centro, s.comuna, s.plan];

// Sección "Suscripciones" del superadmin: plan y estado de cada centro,
// solicitudes de cambio de plan para activar/rechazar y extensión de plazos.
// Las reglas (tope de veterinarios, fechas) viven en la base (migración 28).
export const SuscripcionesSuperAdmin = () => {
  const [recarga, setRecarga] = useState(0);
  const { datos: suscripciones = [], cargando, error } = useConsulta(() => getSuscripcionesSuperadmin(), [recarga]);
  const { ejecutar, ocupado, error: errorAccion } = useAccion();
  const [enCurso, setEnCurso] = useState<number | null>(null);   // centro con una acción en curso
  const [aviso, setAviso] = useState<AvisoEstado | null>(null);

  const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro({
    items: suscripciones,
    camposBusqueda: camposSuscripcion,
    filtros: PREDICADOS_FILTRO_SUSCRIPCIONES,
    filtroInicial: "todas" as FiltroSuscripciones,
  });

  const correr = async (s: SuscripcionListada, accion: () => Promise<void>, textoOk: string) => {
    setEnCurso(s.centroId);
    setAviso(null);
    const ok = await ejecutar(accion, "No se pudo completar la acción.");
    setEnCurso(null);
    if (ok) {
      setAviso({ tipo: "ok", texto: textoOk });
      setRecarga((n) => n + 1);
    }
  };

  const activar = (s: SuscripcionListada) => {
    const sol = s.solicitud;
    if (!sol) return;
    correr(s, () => resolverSolicitudPlan(sol.id, true, MESES_ACTIVACION_PLAN), T.activado(s.centro, sol.plan));
  };

  const rechazar = (s: SuscripcionListada) => {
    const sol = s.solicitud;
    if (!sol || !window.confirm(T.confirmarRechazo(s.centro, sol.plan))) return;
    correr(s, () => resolverSolicitudPlan(sol.id, false), T.rechazado(s.centro));
  };

  const extender = (s: SuscripcionListada) =>
    correr(s, () => extenderSuscripcion(s.centroId, DIAS_EXTENSION_SUSCRIPCION), T.extendido(s.centro));

  const porAtender = suscripciones.filter((s) => s.solicitud).length;

  return (
    <>
      <h1 className={styles.titulo}>{T.titulo}</h1>
      <p className={styles.subtitulo}>{T.subtitulo}</p>

      {aviso && <Aviso {...aviso} onCerrar={() => setAviso(null)} />}
      {errorAccion && <Aviso tipo="error" texto={errorAccion} />}
      {porAtender > 0 && (
        <p className={styles.alerta}>
          {porAtender === 1 ? "Hay 1 solicitud de cambio de plan esperando respuesta." : `Hay ${porAtender} solicitudes de cambio de plan esperando respuesta.`}
        </p>
      )}

      <BarraFiltros
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por centro, comuna o plan…"
        opciones={FILTROS_SUSCRIPCIONES}
        filtro={filtro}
        onFiltro={setFiltro}
        cantidad={cantidad}
      />

      <TablaPanel
        columnas={COLUMNAS}
        encabezados={["Centro", "Plan", "Estado", "Vence", "Vets", "Solicitud", ""]}
        cargando={cargando}
        error={error}
        vacio={suscripciones.length === 0 ? T.vacio : T.vacioFiltro}
        cantidad={visibles.length}
      >
        {visibles.map((s) => {
          const lleno = s.limite !== null && s.veterinarios >= s.limite;
          const ocupada = ocupado && enCurso === s.centroId;
          return (
            <FilaTabla key={s.centroId} columnas={COLUMNAS} atenuada={ocupada}>
              <div className={styles.celdaDoble}>
                <span className={styles.fuerte}>{s.centro}</span>
                <span className={styles.detalle}>
                  {s.comuna}{s.esPrueba && <> · <Etiqueta {...ETIQUETA_PRUEBA} /></>}
                </span>
              </div>
              <span className={styles.suave}>{s.plan}</span>
              <Etiqueta {...ESTADO_SUSCRIPCION[s.estado]} />
              <span className={styles.suave}>{s.vence ?? "—"}</span>
              <span className={lleno ? styles.fuerte : styles.suave} title={lleno ? "Llegó al límite de su plan" : undefined}>
                {s.veterinarios}/{s.limite ?? T.ilimitado}
              </span>
              {s.solicitud ? (
                <div className={styles.celdaDoble}>
                  <span className={styles.fuerte}>Pide: {s.solicitud.plan}</span>
                  <span className={`${styles.detalle} ${styles.recortado}`} title={s.solicitud.mensaje ?? undefined}>
                    {s.solicitud.solicitante} · {s.solicitud.fecha}{s.solicitud.mensaje ? ` · “${s.solicitud.mensaje}”` : ""}
                  </span>
                </div>
              ) : (
                <span className={styles.suave}>{T.sinSolicitud}</span>
              )}
              <div className={styles.acciones}>
                {s.solicitud && (
                  <>
                    <button type="button" className={styles.botonPrimario} disabled={ocupado} onClick={() => activar(s)}>
                      {T.activar}
                    </button>
                    <button type="button" className={styles.botonPeligro} disabled={ocupado} onClick={() => rechazar(s)}>
                      {T.rechazar}
                    </button>
                  </>
                )}
                <button type="button" className={styles.botonSuave} disabled={ocupado} onClick={() => extender(s)}>
                  {T.extender}
                </button>
              </div>
            </FilaTabla>
          );
        })}
      </TablaPanel>
    </>
  );
};
