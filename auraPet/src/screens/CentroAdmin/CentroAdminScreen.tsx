import { useState, type ReactElement } from "react";
import { TEXTOS_CENTRO_ADMIN as T } from "../../constants";
import { useAuth } from "../../Auth/AuthContext";
import { useConsulta } from "../../hooks/useConsulta";
import { getMisCentrosAdmin } from "../../Api/getInfo";
import { ConfiguracionModal } from "../../Modal/ConfiguracionModal";
import { DarEnAdopcionModal } from "../../Modal/DarEnAdopcionModal";
import { SeccionMisPublicaciones } from "../../components/adopcion/publicaciones/SeccionMisPublicaciones";
import { SeccionMiRefugio } from "../../components/adopcion/refugios/miRefugio/SeccionMiRefugio";
import { useAdministraRefugio } from "../../hooks/useAdministraRefugio";
import { MenuLateralCentro } from "../../components/centroAdmin/MenuLateralCentro";
import type { CentroAdminScreenProps, SeccionCentroAdmin } from "../../interfaces";
import { SeccionResumenCentro } from "./SeccionResumenCentro";
import { SeccionAgendaCentro } from "./SeccionAgendaCentro";
import { SeccionEquipoCentro } from "./SeccionEquipoCentro";
import { SeccionMiCentro } from "./SeccionMiCentro";
import { SeccionSuscripcion } from "./SeccionSuscripcion";
import layout from "../../css/superadmin/SuperAdminLayout.module.css";
import styles from "../../css/centroAdmin/PanelCentro.module.css";

// Panel del centro: lo usan los admins de un centro (cargo en admins_centro),
// sean veterinarios o cuentas "administrativo". Arma la estructura (menú,
// barra con el selector de centro) y muestra la sección elegida.
export const CentroAdminScreen = ({ centroInicialId, onVolver }: CentroAdminScreenProps) => {
  const { usuarioActual } = useAuth();
  const [seccion, setSeccion] = useState<SeccionCentroAdmin>("resumen");
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [darEnAdopcion, setDarEnAdopcion] = useState(false);
  const [versionPublicaciones, setVersionPublicaciones] = useState(0);
  const conRefugio = useAdministraRefugio();

  // Centros que administra (puede ser más de uno)
  const { datos: misCentros = [], cargando: cargandoCentros } =
    useConsulta(() => getMisCentrosAdmin(usuarioActual!.id), [usuarioActual!.id]);
  const [centroId, setCentroId] = useState<number | null>(centroInicialId ?? null);
  // Si no venía un centro elegido, se abre el primero de la lista
  const centroActivo = centroId ?? misCentros[0]?.id ?? null;

  const secciones = (id: number): Record<SeccionCentroAdmin, ReactElement> => ({
    resumen: <SeccionResumenCentro centroId={id} onIrA={setSeccion} />,
    agenda: <SeccionAgendaCentro centroId={id} />,
    equipo: <SeccionEquipoCentro centroId={id} />,
    centro: <SeccionMiCentro centroId={id} />,
    suscripcion: <SeccionSuscripcion centroId={id} />,
    publicaciones: <SeccionMisPublicaciones version={versionPublicaciones} onDarEnAdopcion={() => setDarEnAdopcion(true)} />,
    refugio: <SeccionMiRefugio />,
  });

  return (
    <div className={layout.pagina}>
      <MenuLateralCentro seccion={seccion} onCambiar={setSeccion} onVolver={onVolver}
        onConfiguracion={() => setMostrarConfiguracion(true)} onDarEnAdopcion={() => setDarEnAdopcion(true)} conRefugio={conRefugio} />

      <div className={layout.principal}>
        {/* Barra superior: selector de centro (si administra más de uno) y usuario */}
        <header className={`${layout.topbar} ${styles.topbar}`}>
          <div className={styles.administrando}>
            {T.administrando}
            {misCentros.length > 1 ? (
              <select className={styles.selectorCentro} value={centroActivo ?? ""}
                onChange={(e) => setCentroId(Number(e.target.value))} aria-label="Centro">
                {misCentros.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            ) : (
              <strong className={styles.nombreCentro}>{misCentros[0]?.nombre ?? "—"}</strong>
            )}
          </div>
          <span className={styles.usuario}>{usuarioActual?.nombre}</span>
        </header>

        <main className={layout.contenido}>
          {cargandoCentros ? (
            <p className={styles.estado}>Cargando…</p>
          ) : centroActivo === null ? (
            <div className={styles.vacioGrande}>{T.sinCentro}</div>
          ) : (
            // key: al cambiar de centro, la sección se reinicia con sus datos
            <div key={centroActivo}>{secciones(centroActivo)[seccion]}</div>
          )}
        </main>
      </div>

      {mostrarConfiguracion && <ConfiguracionModal onCerrar={() => setMostrarConfiguracion(false)} />}
      {darEnAdopcion && (
        <DarEnAdopcionModal onCerrar={() => setDarEnAdopcion(false)} onPublicada={() => setVersionPublicaciones((n) => n + 1)} />
      )}
    </div>
  );
};
