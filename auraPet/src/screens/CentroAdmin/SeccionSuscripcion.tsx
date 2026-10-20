import { useState } from "react";
import {
  COLUMNAS_HISTORIAL_SUSCRIPCION, ESTADO_HISTORIAL_SUSCRIPCION, PREGUNTAS_SUSCRIPCION, TEXTOS_SUSCRIPCION,
} from "../../constants";
import { getHistorialSuscripcion, getPlanes, getSuscripcionCentro } from "../../Api/getInfo";
import { useConsulta } from "../../hooks/useConsulta";
import { planSiguiente } from "../../lib/suscripcion";
import type { Plan, SeccionSuscripcionProps } from "../../interfaces";
import { HeroPlan } from "../../components/centroAdmin/HeroPlan";
import { UsoPlan } from "../../components/centroAdmin/UsoPlan";
import { ComparadorPlanes } from "../../components/centroAdmin/ComparadorPlanes";
import { CambioPlanModal } from "../../Modal/CambioPlanModal";
import { TablaPanel } from "../../components/ui/TablaPanel";
import { FilaTabla } from "../../components/ui/FilaTabla";
import { Etiqueta } from "../../components/ui/Etiqueta";
import { Aviso } from "../../components/ui/Aviso";
import { Acordeon } from "../../components/ui/Acordeon";
import styles from "../../css/centroAdmin/Suscripcion.module.css";

const T = TEXTOS_SUSCRIPCION;

// Sección "Suscripción" del panel del centro: plan actual, uso, comparador,
// historial y preguntas. Pide los datos y arma las piezas.
export const SeccionSuscripcion = ({ centroId }: SeccionSuscripcionProps) => {
  const [recarga, setRecarga] = useState(0);
  const [planElegido, setPlanElegido] = useState<Plan | null>(null);

  const { datos, cargando, error } = useConsulta(async () => {
    const planes = await getPlanes();
    const suscripcion = await getSuscripcionCentro(centroId, planes);
    return { planes, suscripcion };
  }, [centroId, recarga]);
  const { datos: historial = [], cargando: cargandoHistorial, error: errorHistorial } =
    useConsulta(() => getHistorialSuscripcion(centroId), [centroId, recarga]);

  const planes = datos?.planes ?? [];
  const suscripcion = datos?.suscripcion ?? null;
  const planMejora = suscripcion ? planSiguiente(planes, suscripcion.plan) : null;
  const nombreSolicitado = planes.find((p) => p.id === suscripcion?.planSolicitado)?.nombre;

  return (
    <>
      <h1 className={styles.titulo}>{T.titulo}</h1>
      <p className={styles.subtitulo}>{T.subtitulo}</p>

      {cargando && <p className={styles.estado}>Cargando…</p>}
      {error && <Aviso tipo="error" texto={error} />}
      {!cargando && !error && !suscripcion && <Aviso tipo="info" texto="Este centro todavía no tiene una suscripción." />}

      {suscripcion && (
        <div className={styles.columna}>
          {nombreSolicitado && <Aviso tipo="info" texto={T.solicitudPendiente(nombreSolicitado)} />}

          <HeroPlan suscripcion={suscripcion} planMejora={planMejora} onMejorar={setPlanElegido} />
          <UsoPlan suscripcion={suscripcion} planMejora={planMejora} onMejorar={setPlanElegido} />
          <ComparadorPlanes
            planes={planes}
            planActual={suscripcion.plan.id}
            estadoActual={suscripcion.estado}
            planSolicitado={suscripcion.planSolicitado}
            onElegir={setPlanElegido}
          />

          <div className={styles.dosColumnas}>
            <TablaPanel
              titulo={T.historialTitulo}
              columnas={COLUMNAS_HISTORIAL_SUSCRIPCION}
              encabezados={["Fecha", "Movimiento", "Detalle", "Estado"]}
              cargando={cargandoHistorial}
              error={errorHistorial}
              vacio={T.sinHistorial}
              cantidad={historial.length}
            >
              {historial.map((h) => (
                <FilaTabla key={h.id} columnas={COLUMNAS_HISTORIAL_SUSCRIPCION}>
                  <span className={styles.suave}>{h.fecha}</span>
                  <span>{h.accion}</span>
                  <span className={styles.suave}>{h.detalle ?? "—"}</span>
                  <Etiqueta {...ESTADO_HISTORIAL_SUSCRIPCION[h.estado]} />
                </FilaTabla>
              ))}
            </TablaPanel>
            <Acordeon titulo={T.preguntasTitulo} items={PREGUNTAS_SUSCRIPCION} />
          </div>
        </div>
      )}

      {planElegido && (
        <CambioPlanModal
          centroId={centroId}
          plan={planElegido}
          onCerrar={() => setPlanElegido(null)}
          onEnviado={() => setRecarga((n) => n + 1)}
        />
      )}
    </>
  );
};
