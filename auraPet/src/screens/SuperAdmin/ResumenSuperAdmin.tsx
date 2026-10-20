import { Iconos, LIMITE_CITAS_RESUMEN, LIMITE_PENDIENTES_RESUMEN, TEXTOS_SUPERADMIN } from "../../constants";
import { getAllCitas, getResumenSuperadmin } from "../../Api/getInfo";
import { useConsulta } from "../../hooks/useConsulta";
import type { ResumenSuperAdminProps } from "../../interfaces";
import { KpiCard } from "../../components/ui/KpiCard";
import { TablaSolicitudes } from "../../components/superadmin/TablaSolicitudes";
import { TablaCitas } from "../../components/superadmin/TablaCitas";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

// Sección "Resumen": números clave, las primeras solicitudes pendientes y
// las próximas citas. Cada bloque lleva a su sección completa.
export const ResumenSuperAdmin = ({ solicitudes, recarga, onIrA }: ResumenSuperAdminProps) => {
  const { datos: resumen, cargando: cargandoResumen } = useConsulta(() => getResumenSuperadmin(), [recarga]);
  const { datos: proximas, cargando: cargandoCitas, error: errorCitas } = useConsulta(
    () => getAllCitas({ busqueda: "", estado: null, urgencia: null, rango: "proximas", pagina: 1, porPagina: LIMITE_CITAS_RESUMEN }),
    [recarga]
  );

  const { pendientes } = solicitudes;
  const verTodas = (destino: "aprobaciones" | "citas") => (
    <button type="button" className={styles.link} onClick={() => onIrA(destino)}>
      {TEXTOS_SUPERADMIN.verTodas} <Iconos.verMas size={15} aria-hidden="true" />
    </button>
  );

  return (
    <>
      <h1 className={styles.titulo}>{TEXTOS_SUPERADMIN.resumen}</h1>
      <p className={styles.subtitulo}>Lo más importante de AuraPet de un vistazo.</p>

      <div className={styles.kpis}>
        <KpiCard
          icon={<Iconos.usuarios size={17} />}
          label="Usuarios activos"
          value={resumen?.usuarios.total ?? 0}
          cargando={cargandoResumen}
          hint={resumen && `${resumen.usuarios.duenos} dueños · ${resumen.usuarios.veterinarios} veterinarios · ${resumen.usuarios.superadmins} superadmin`}
          onClick={() => onIrA("usuarios")}
        />
        <KpiCard
          icon={<Iconos.centro size={17} />}
          label="Centros activos"
          value={resumen?.centros.activos ?? 0}
          cargando={cargandoResumen}
          hint={resumen && (resumen.centros.dePrueba > 0 ? `${resumen.centros.dePrueba} de pruebas` : "Ninguno de pruebas")}
          onClick={() => onIrA("centros")}
        />
        <KpiCard
          icon={<Iconos.diagnostico size={17} />}
          label="Veterinarios"
          value={resumen?.veterinarios.total ?? 0}
          cargando={cargandoResumen}
          hint={resumen && `${resumen.veterinarios.verificados} verificados · ${resumen.veterinarios.pendientes} pendientes`}
          onClick={() => onIrA("asignaciones")}
        />
        <KpiCard
          icon={<Iconos.calendario size={17} />}
          label="Citas hoy"
          value={resumen?.citasHoy.total ?? 0}
          cargando={cargandoResumen}
          hint={resumen && (resumen.citasHoy.urgentes > 0
            ? <span className={styles.alerta}>{resumen.citasHoy.urgentes} urgentes</span>
            : "Sin urgencias")}
          onClick={() => onIrA("citas")}
        />
      </div>

      <TablaSolicitudes
        titulo={`${TEXTOS_SUPERADMIN.solicitudesPendientes}${pendientes.length ? ` (${pendientes.length})` : ""}`}
        accion={pendientes.length > LIMITE_PENDIENTES_RESUMEN ? verTodas("aprobaciones") : undefined}
        solicitudes={pendientes.slice(0, LIMITE_PENDIENTES_RESUMEN)}
        cargando={solicitudes.cargando}
        onAprobar={solicitudes.aprobar}
        onRechazar={solicitudes.pedirRechazo}
        onVerDetalle={solicitudes.abrirDetalle}
      />

      <TablaCitas
        titulo={TEXTOS_SUPERADMIN.proximasCitas}
        accion={verTodas("citas")}
        citas={proximas?.citas ?? []}
        cargando={cargandoCitas}
        error={errorCitas}
        vacio={TEXTOS_SUPERADMIN.sinProximasCitas}
      />
    </>
  );
};
