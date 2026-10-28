import { useState, type ReactElement } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useSolicitudesSuperAdmin } from "../../hooks/useSolicitudesSuperAdmin";
import type { SeccionSuperAdmin, TipoCrearSuperAdmin } from "../../interfaces";
import { MenuLateralSuperAdmin } from "../../components/superadmin/MenuLateralSuperAdmin";
import { BarraSuperiorSuperAdmin } from "../../components/superadmin/BarraSuperiorSuperAdmin";
import { Aviso } from "../../components/ui/Aviso";
import { RechazarModal } from "../../Modal/ReachazarModal";
import { DetalleSolicitudCentroModal } from "../../Modal/DetalleSolicitudCentroModal";
import { ConfiguracionModal } from "../../Modal/ConfiguracionModal";
import { DarEnAdopcionModal } from "../../Modal/DarEnAdopcionModal";
import { SeccionMisPublicaciones } from "../../components/adopcion/publicaciones/SeccionMisPublicaciones";
import { SeccionRefugiosAdmin } from "../../components/adopcion/refugios/admin/SeccionRefugiosAdmin";
import { SeccionMiRefugio } from "../../components/adopcion/refugios/miRefugio/SeccionMiRefugio";
import { useAdministraRefugio } from "../../hooks/useAdministraRefugio";
import { ModalCrearProfesional } from "../../Modal/CrearProfesionalModal";
import { ModalCrearDueno } from "../../Modal/CrearDuenoModal";
import { ModalCrearSuperadmin } from "../../Modal/CrearSuperadminModal";
import { ModalCrearCentro } from "../../Modal/CrearCentroModal";
import { ModalCrearAdministrativo } from "../../Modal/CrearAdministrativoModal";
import { ResumenSuperAdmin } from "./ResumenSuperAdmin";
import { ResumenUsuarios } from "./ResumenUsuarios";
import { ListaCentros } from "./ListaCentros";
import { CentrosVeterinarios } from "./CentrosVeterinarios";
import { AprobacionesSuperAdmin } from "./AprobacionesSuperAdmin";
import { CitasSuperAdmin } from "./CitasSuperAdmin";
import { SuscripcionesSuperAdmin } from "./SuscripcionesSuperAdmin";
import { MensajesSuperAdmin } from "./MensajesSuperAdmin";
import { EliminacionesSuperAdmin } from "./EliminacionesSuperAdmin";
import { NotasSuperAdmin } from "./NotasSuperAdmin";
import styles from "../../css/superadmin/SuperAdminLayout.module.css";

// Panel del superadmin: arma la estructura (menú, barra superior y la
// sección activa) y es dueño de los modales que se abren desde cualquier
// sección. La lógica de aprobar/rechazar vive en useSolicitudesSuperAdmin.
export const SuperAdminScreen = () => {
  const { usuarioActual } = useAuth();
  const [seccion, setSeccion] = useState<SeccionSuperAdmin>("resumen");
  const [modalCrear, setModalCrear] = useState<TipoCrearSuperAdmin | null>(null);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [darEnAdopcion, setDarEnAdopcion] = useState(false);
  const [versionPublicaciones, setVersionPublicaciones] = useState(0);
  const conRefugio = useAdministraRefugio();

  // Al crear algo se vuelven a pedir los datos (KPIs, listas, pendientes)
  const [recarga, setRecarga] = useState(0);
  const cerrarModalCrear = () => {
    setModalCrear(null);
    setRecarga((n) => n + 1);
  };

  const solicitudes = useSolicitudesSuperAdmin(recarga);
  const { aviso, cerrarAviso, aRechazar, enDetalle } = solicitudes;

  const secciones: Record<SeccionSuperAdmin, ReactElement> = {
    resumen: <ResumenSuperAdmin solicitudes={solicitudes} recarga={recarga + solicitudes.version} onIrA={setSeccion} />,
    usuarios: <ResumenUsuarios />,
    centros: <ListaCentros />,
    asignaciones: <CentrosVeterinarios />,
    aprobaciones: <AprobacionesSuperAdmin solicitudes={solicitudes} />,
    suscripciones: <SuscripcionesSuperAdmin />,
    mensajes: <MensajesSuperAdmin />,
    eliminaciones: <EliminacionesSuperAdmin />,
    notas: <NotasSuperAdmin />,
    citas: <CitasSuperAdmin />,
    publicaciones: <SeccionMisPublicaciones version={versionPublicaciones} onDarEnAdopcion={() => setDarEnAdopcion(true)} />,
    refugios: <SeccionRefugiosAdmin />,
    miRefugio: <SeccionMiRefugio />,
  };

  return (
    <div className={styles.pagina}>
      <MenuLateralSuperAdmin seccion={seccion} pendientes={solicitudes.pendientes.length} onCambiar={setSeccion} onDarEnAdopcion={() => setDarEnAdopcion(true)} conRefugio={conRefugio} />

      <div className={styles.principal}>
        <BarraSuperiorSuperAdmin
          nombre={usuarioActual?.nombre ?? "SuperAdmin"}
          pendientes={solicitudes.pendientes.length}
          onCrear={setModalCrear}
          onNotificaciones={() => setSeccion("aprobaciones")}
          onConfiguracion={() => setMostrarConfiguracion(true)}
        />

        <main className={styles.contenido}>
          {aviso && <Aviso {...aviso} onCerrar={cerrarAviso} />}
          {secciones[seccion]}
        </main>
      </div>

      {/* Detalle de una solicitud de centro (Rechazar abre el modal de rechazo encima) */}
      {enDetalle && (
        <DetalleSolicitudCentroModal
          solicitudId={Number(enDetalle.id.split("-")[1])}
          ocupado={solicitudes.ocupado}
          error={solicitudes.errorDetalle}
          onAprobar={() => solicitudes.aprobar(enDetalle)}
          onRechazar={() => solicitudes.pedirRechazo(enDetalle)}
          onCerrar={solicitudes.cerrarDetalle}
        />
      )}
      {aRechazar && (
        <RechazarModal
          nombreSolicitud={aRechazar.nombre}
          ocupado={solicitudes.ocupado}
          onCancelar={solicitudes.cancelarRechazo}
          onConfirmar={solicitudes.confirmarRechazo}
        />
      )}

      {mostrarConfiguracion && <ConfiguracionModal onCerrar={() => setMostrarConfiguracion(false)} />}
      {darEnAdopcion && (
        <DarEnAdopcionModal onCerrar={() => setDarEnAdopcion(false)} onPublicada={() => setVersionPublicaciones((n) => n + 1)} />
      )}
      {modalCrear === "profesional" && <ModalCrearProfesional onClose={cerrarModalCrear} />}
      {modalCrear === "dueno" && <ModalCrearDueno onClose={cerrarModalCrear} />}
      {modalCrear === "administrativo" && <ModalCrearAdministrativo onClose={cerrarModalCrear} />}
      {modalCrear === "superadmin" && <ModalCrearSuperadmin onClose={cerrarModalCrear} />}
      {modalCrear === "centro" && <ModalCrearCentro onClose={cerrarModalCrear} />}
    </div>
  );
};
