import { useState } from "react";
import {
  COLUMNAS_SUPERADMIN, ETIQUETA_DECISION, FILTROS_HISTORIAL, PREDICADOS_FILTRO_HISTORIAL,
  TEXTOS_APROBACIONES, TIPO_SOLICITUD_LABEL,
} from "../../constants";
import { getHistorialAprobaciones } from "../../Api/getInfo";
import { useConsulta } from "../../hooks/useConsulta";
import { useFiltro } from "../../hooks/useFiltro";
import type { AprobacionesSuperAdminProps, FiltroHistorial, PestanaAprobaciones, SolicitudHistorial } from "../../interfaces";
import { TablaSolicitudes } from "../../components/superadmin/TablaSolicitudes";
import { TablaPanel } from "../../components/ui/TablaPanel";
import { FilaTabla } from "../../components/ui/FilaTabla";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import { Etiqueta } from "../../components/ui/Etiqueta";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const COLUMNAS = COLUMNAS_SUPERADMIN.historial;
const camposHistorial = (s: SolicitudHistorial) => [s.nombre, s.revisadoPor, s.motivo];

// Sección "Aprobaciones": las pendientes (para resolver) y el historial de
// lo ya aprobado o rechazado, con quién lo revisó y por qué.
export const AprobacionesSuperAdmin = ({ solicitudes }: AprobacionesSuperAdminProps) => {
  const [pestana, setPestana] = useState<PestanaAprobaciones>("pendientes");
  // El historial se vuelve a pedir cada vez que se resuelve una solicitud
  const { datos: historial = [], cargando, error } = useConsulta(() => getHistorialAprobaciones(), [solicitudes.version]);

  const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro({
    items: historial,
    camposBusqueda: camposHistorial,
    filtros: PREDICADOS_FILTRO_HISTORIAL,
    filtroInicial: "todas" as FiltroHistorial,
  });

  const pestanas: { valor: PestanaAprobaciones; texto: string; cantidad: number }[] = [
    { valor: "pendientes", texto: TEXTOS_APROBACIONES.pendientes, cantidad: solicitudes.pendientes.length },
    { valor: "historial", texto: TEXTOS_APROBACIONES.historial, cantidad: historial.length },
  ];

  return (
    <>
      <h1 className={styles.titulo}>{TEXTOS_APROBACIONES.titulo}</h1>
      <p className={styles.subtitulo}>{TEXTOS_APROBACIONES.subtitulo}</p>

      <div className={styles.pestanas} role="tablist">
        {pestanas.map((p) => (
          <button
            key={p.valor}
            type="button"
            role="tab"
            aria-selected={pestana === p.valor}
            className={`${styles.pestana} ${pestana === p.valor ? styles.pestanaActiva : ""}`}
            onClick={() => setPestana(p.valor)}
          >
            {p.texto}
            <span className={styles.contadorPestana}>{p.cantidad}</span>
          </button>
        ))}
      </div>

      {pestana === "pendientes" ? (
        <TablaSolicitudes
          solicitudes={solicitudes.pendientes}
          cargando={solicitudes.cargando}
          onAprobar={solicitudes.aprobar}
          onRechazar={solicitudes.pedirRechazo}
          onVerDetalle={solicitudes.abrirDetalle}
        />
      ) : (
        <>
          <BarraFiltros
            busqueda={busqueda}
            onBuscar={setBusqueda}
            placeholder={TEXTOS_APROBACIONES.buscar}
            opciones={FILTROS_HISTORIAL}
            filtro={filtro}
            onFiltro={setFiltro}
            cantidad={cantidad}
          />
          <TablaPanel
            columnas={COLUMNAS}
            encabezados={["Solicitud", "Tipo", "Decisión", "Revisada por", "Fecha", "Motivo"]}
            cargando={cargando}
            error={error}
            vacio={historial.length === 0 ? TEXTOS_APROBACIONES.sinHistorial : TEXTOS_APROBACIONES.sinCoincidencias}
            cantidad={visibles.length}
          >
            {visibles.map((s) => (
              <FilaTabla key={s.id} columnas={COLUMNAS}>
                <span className={styles.fuerte}>{s.nombre}</span>
                <span className={styles.suave}>{TIPO_SOLICITUD_LABEL[s.tipo]}</span>
                <Etiqueta {...ETIQUETA_DECISION[s.decision]} />
                <span className={styles.suave}>{s.revisadoPor}</span>
                <span className={styles.suave}>{s.fecha}</span>
                <span className={styles.motivo} title={s.motivo ?? undefined}>{s.motivo ?? "—"}</span>
              </FilaTabla>
            ))}
          </TablaPanel>
        </>
      )}
    </>
  );
};
