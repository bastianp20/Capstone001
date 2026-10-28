import { useState } from 'react';
import { CONFIRMACIONES, Iconos, MAX_CITAS_INICIO_DUENO, MAX_HISTORIAL_INICIO_DUENO } from '../../constants';
import { useConsulta } from '../../hooks/useConsulta';
import { useConfirmar } from '../../hooks/useConfirmar';
import { getMascotasPorDueno, getProximasCitasDueno, getHistorialRecienteDueno, getHistorialDueno, getDerivaciones } from '../../Api/getInfo';
import { DerivacionesDueno } from '../../components/dueno/DerivacionesDueno';
import { cancelarCita } from '../../Api/postInfo';
import { getIniciales } from '../../utils';
import { useAuth } from '../../Auth/AuthContext';
import type { HistorialDueno, ItemMenuDueno, SeccionDueno } from '../../interfaces';
import { ConfiguracionModal } from '../../Modal/ConfiguracionModal';
import { DarEnAdopcionModal } from '../../Modal/DarEnAdopcionModal';
import { SeccionMisPublicaciones } from '../../components/adopcion/publicaciones/SeccionMisPublicaciones';
import { SeccionMiRefugio } from '../../components/adopcion/refugios/miRefugio/SeccionMiRefugio';
import { useAdministraRefugio } from '../../hooks/useAdministraRefugio';
import { ModalCrearMascota } from '../../Modal/AgregarMascotaModal';
import { ModalSolicitarCita } from '../../Modal/SolicitarCitaModal';
import { MenuDueno } from '../../components/dueno/MenuDueno';
import { GrillaMascotas } from '../../components/dueno/GrillaMascotas';
import { ProximasCitasDueno } from '../../components/dueno/ProximasCitasDueno';
import { HistorialReciente } from '../../components/dueno/HistorialReciente';
import { HistorialMedico } from '../../components/dueno/HistorialMedico';
import '../../css/duenoPage.css';
import LogoAuraPetSinFondo from '../../assets/logo/LogoAuraPetSinFondo.png';

const iconos = Iconos;



const HISTORIAL_VACIO: HistorialDueno = { registros: [], recetas: [] };

type Modal = "configuracion" | "mascota" | "cita" | "adopcion" | null;

// Panel del dueño. Esta pantalla maneja la navegación, los datos y los modales;
// cada parte visual vive en components/dueno/.
export const DuenoScreen = () => {
  const { usuarioActual } = useAuth();
  const duenoId = usuarioActual!.id; // App.tsx ya garantiza que hay sesión antes de montar esta pantalla
  const nombreDueno = usuarioActual!.nombre;

  // ---------- Navegación y modales ----------
  const [seccion, setSeccion] = useState<SeccionDueno>("inicio");
  const [modal, setModal] = useState<Modal>(null);
  // Sube al publicar en adopción, para que "Mis publicaciones" se recargue
  const [versionPublicaciones, setVersionPublicaciones] = useState(0);
  const conRefugio = useAdministraRefugio();
  const [mascotaParaCita, setMascotaParaCita] = useState<number | undefined>(undefined);

  // ---------- Datos ----------
  // "recarga" sube en 1 después de crear/cancelar algo → useConsulta vuelve a pedir los datos
  const [recarga, setRecarga] = useState(0);
  const recargar = () => setRecarga((n) => n + 1);

  const { datos: mascotas = [] } = useConsulta(() => getMascotasPorDueno(duenoId), [duenoId, recarga]);
  const { datos: proximasCitas = [] } =
    useConsulta(() => getProximasCitasDueno(duenoId, MAX_CITAS_INICIO_DUENO), [duenoId, recarga]);
  const { datos: historialReciente = [] } =
    useConsulta(() => getHistorialRecienteDueno(duenoId, MAX_HISTORIAL_INICIO_DUENO), [duenoId, recarga]);
  // El historial completo solo se pide al entrar a esa sección
  const { datos: historial = HISTORIAL_VACIO, cargando: cargandoHistorial } = useConsulta(
    () => (seccion === "historial" ? getHistorialDueno() : Promise.resolve(HISTORIAL_VACIO)),
    [seccion, recarga]
  );
  const { datos: derivaciones = [] } = useConsulta(
    () => (seccion === "historial" ? getDerivaciones() : Promise.resolve([])),
    [seccion, recarga]
  );

  // ---------- Acciones ----------
  const elegirMenu = (id: ItemMenuDueno["id"]) => {
    if (id === "solicitar") abrirSolicitarCita();
    else if (id === "configuracion") setModal("configuracion");
    else if (id === "adopcion") setModal("adopcion");
    else setSeccion(id);
  };

  const abrirSolicitarCita = (mascotaId?: number) => {
    setMascotaParaCita(mascotaId);
    setModal("cita");
  };

  const confirmar = useConfirmar();
  const [cancelandoId, setCancelandoId] = useState<number | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const cancelar = async (citaId: number) => {
    const cita = proximasCitas.find((c) => c.id === citaId);
    const detalle = cita && `${cita.mascota} · ${cita.dia} ${cita.mes} · ${cita.hora} · ${cita.centro}`;
    if (!(await confirmar(CONFIRMACIONES.cancelarCita(detalle)))) return;
    setCancelandoId(citaId);
    setAviso(null);
    try {
      await cancelarCita(citaId);
      recargar();
    } catch (e) {
      setAviso(e instanceof Error ? e.message : "No se pudo cancelar la cita.");
    } finally {
      setCancelandoId(null);
    }
  };

  // Botones de la cabecera (se repiten en Inicio y Mis mascotas)
  const accionesRapidas = (
    <div className="dueno-acciones-rapidas">
      <button className="dueno-btn dueno-btn--secundario" onClick={() => setModal("mascota")}>
        <iconos.agregar size={15} /> Registrar mascota
      </button>
      <button className="dueno-btn dueno-btn--primario" onClick={() => abrirSolicitarCita()}>
        <iconos.solicitarCita size={15} /> Solicitar cita
      </button>
    </div>
  );

  return (
    <div className="dueno-page">
      {/* ---------- Menú lateral ---------- */}
      <div className="dueno-sidebar">
        <div className="dueno-sidebar-brand">
          <img src={LogoAuraPetSinFondo} alt="AuraPet" className="landing-logo-icono" />
          <span className="dueno-sidebar-brand-name">AuraPet</span>
        </div>
        <MenuDueno seccion={seccion} onElegir={elegirMenu} conRefugio={conRefugio} />
      </div>

      <div className="dueno-main">
        {/* ---------- Barra superior ---------- */}
        <div className="dueno-topbar">
          <div />
          <div className="dueno-topbar-right">
            <div className="dueno-usuario">
              <div className="dueno-avatar">{getIniciales(nombreDueno)}</div>
              <div className="dueno-usuario-info">
                <span className="dueno-usuario-nombre">{nombreDueno}</span>
                <span className="dueno-usuario-rol">Dueñ@{usuarioActual!.esPrueba && " · Cuenta de prueba"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dueno-content">
          {aviso && <div className="dueno-aviso-error">{aviso}</div>}

          {/* ---------- INICIO ---------- */}
          {seccion === "inicio" && (
            <>
              <div className="dueno-content-header">
                <div>
                  <h1 className="dueno-content-titulo">Hola, {nombreDueno.split(" ")[0]} 👋</h1>
                  <p className="dueno-content-subtitulo">Esto es lo que está pasando con tus mascotas</p>
                </div>
                {accionesRapidas}
              </div>

              <section className="dueno-seccion">
                <div className="dueno-seccion-header">
                  <h2 className="dueno-seccion-titulo">Mis mascotas</h2>
                  <a className="dueno-seccion-link" onClick={() => setSeccion("mascotas")}>Ver todas →</a>
                </div>
                <GrillaMascotas mascotas={mascotas} onAgregar={() => setModal("mascota")} />
              </section>

              <div className="dueno-dos-columnas">
                <ProximasCitasDueno citas={proximasCitas} onCancelar={cancelar} cancelandoId={cancelandoId} />
                <HistorialReciente items={historialReciente} />
              </div>
            </>
          )}

          {/* ---------- MIS MASCOTAS ---------- */}
          {seccion === "mascotas" && (
            <>
              <div className="dueno-content-header">
                <div>
                  <h1 className="dueno-content-titulo">Mis mascotas</h1>
                  <p className="dueno-content-subtitulo">Pide hora para cualquiera de ellas desde su tarjeta</p>
                </div>
                {accionesRapidas}
              </div>
              <GrillaMascotas mascotas={mascotas} onAgregar={() => setModal("mascota")} onSolicitarCita={abrirSolicitarCita} />
            </>
          )}

          {/* ---------- HISTORIAL MÉDICO ---------- */}
          {seccion === "historial" && (
            <>
              <div className="dueno-content-header">
                <div>
                  <h1 className="dueno-content-titulo">Historial médico</h1>
                  <p className="dueno-content-subtitulo">Atenciones, vacunas y recetas de tus mascotas</p>
                </div>
              </div>
              <DerivacionesDueno derivaciones={derivaciones} />
              <HistorialMedico mascotas={mascotas} historial={historial} cargando={cargandoHistorial} />
            </>
          )}

          {seccion === "publicaciones" && (
            <SeccionMisPublicaciones version={versionPublicaciones} onDarEnAdopcion={() => setModal("adopcion")} />
          )}

          {seccion === "refugio" && <SeccionMiRefugio />}
        </div>
      </div>

      {/* ---------- Modales ---------- */}
      {modal === "configuracion" && <ConfiguracionModal onCerrar={() => setModal(null)} />}
      {modal === "adopcion" && (
        <DarEnAdopcionModal onCerrar={() => setModal(null)} onPublicada={() => setVersionPublicaciones((n) => n + 1)} />
      )}
      {modal === "mascota" && (
        <ModalCrearMascota
          duenoId={duenoId}
          onClose={() => setModal(null)}
          onCreada={() => {
            recargar();      // vuelve a cargar "Mis mascotas"
            setModal(null);  // cierra el modal
          }}
        />
      )}
      {modal === "cita" && (
        <ModalSolicitarCita
          mascotas={mascotas}
          mascotaInicialId={mascotaParaCita}
          onClose={() => setModal(null)}
          onCreada={recargar} // el modal muestra su pantalla de éxito; la lista se actualiza detrás
        />
      )}
    </div>
  );
};
