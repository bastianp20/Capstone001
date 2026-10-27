import { useState } from 'react';
import { ICONO_DAR_EN_ADOPCION as IconoAdopcion, Iconos, TEXTOS_CENTRO_VETERINARIO, TEXTOS_DAR_EN_ADOPCION_PANEL } from '../../constants';
import { getInfoVeterinario, getMisCentrosAdmin } from '../../Api/getInfo';
import { useConsulta } from '../../hooks/useConsulta';
import { ModalAgenda } from '../../Modal/AgendaModal';
import {PacientesModal} from '../../Modal/PacientesModal'; 
import type { PestanaAgenda, VeterinarioScreenProps } from '../../interfaces';
import '../../css/VeterinariosPage.css';
import { RecetaModal } from '../../Modal/RecetasModal';
import { DerivacionesModal } from '../../Modal/DerivacionesModal';
import { NotasModal } from '../../Modal/NotasModal';
import { ConfiguracionModal } from '../../Modal/ConfiguracionModal';
import { DarEnAdopcionModal } from '../../Modal/DarEnAdopcionModal';
import { useAuth } from '../../Auth/AuthContext';
import { InicioVeterinario } from '../../components/veterinario/InicioVeterinario';
import { Aviso } from '../../components/ui/Aviso';
import { textoCentroVeterinario } from '../../lib/centroVeterinario';
import LogoAuraPetSinFondo from '../../assets/logo/LogoAuraPetSinFondo.png'; 

const iconos = Iconos;


export const VeterinarioScreen = ({ onAdministrarCentro }: VeterinarioScreenProps) => {
  const { usuarioActual } = useAuth();

  // Centros que esta persona administra (cargo en admins_centro)
  const { datos: centrosAdmin = [] } =
    useConsulta(() => getMisCentrosAdmin(usuarioActual!.id), [usuarioActual!.id]);

  // Ficha de veterinario de esta cuenta (id de la tabla veterinarios + centros).
  // La agenda y los pacientes usan ese id, no el de la cuenta.
  const { datos: infoVeterinario = { id: null, centros: [], estado: null, centroSolicitado: null, centroMencionado: null } } =
    useConsulta(() => getInfoVeterinario(usuarioActual!.id), [usuarioActual!.id]);
  // -1 mientras carga o si la cuenta todavía no tiene ficha profesional: las consultas devuelven [].
  const veterinarioIdActual = infoVeterinario.id ?? -1;

  // Sus centros; si no tiene, lo que pidió al registrarse (mientras está en
  // revisión) o "atención independiente". Ver lib/centroVeterinario.ts
  const centroLabel = textoCentroVeterinario(infoVeterinario);
  const enRevision = infoVeterinario.estado === "pendiente";

  // Controla qué modal está abierto. Por ahora solo existe el de agenda;
  // cuando armemos Historial/Recetas se suman como más valores posibles
  // ("historial" | "recetas" | ...) en vez de un booleano por modal.
  const [modalAbierto, setModalAbierto] = useState<"agenda" | "pacientes" | "receta" | "derivaciones" | "notas" | "adopcion" | "configuracion" | null>(null);
  // Si la receta se abre desde "Recetar" en una cita, guarda qué mascota viene elegida
  const [pacienteParaReceta, setPacienteParaReceta] = useState<number | null>(null);
  // En qué pestaña se abre la agenda ("Mi Agenda" o la tarjeta "Por confirmar")
  const [pestanaAgenda, setPestanaAgenda] = useState<PestanaAgenda>("agenda");
  // Sube cada vez que la agenda confirma/rechaza una cita, para que el inicio se recargue
  const [versionCitas, setVersionCitas] = useState(0);

  const abrirAgenda = (pestana: PestanaAgenda) => {
    setPestanaAgenda(pestana);
    setModalAbierto("agenda");
  };

  // esto es para el avatar, que ocupe las iniciales de la persona cuando no hay foto de perfil cargada. 
  const getIniciales = (nombreCompleto: string): string => {
    const partes = nombreCompleto.trim().split(" ");
    const primera = partes[0]?.charAt(0) ?? "";
    const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : "";
    return (primera + ultima).toUpperCase();
  };

  return (
    <div className="vet-page">
      {/* logo y nombre de la página */}
      <div className="vet-sidebar">
        <div className="vet-sidebar-brand">
          <img src={LogoAuraPetSinFondo} alt="AuraPet" className="landing-logo-icono" />
          <span className="vet-sidebar-brand-name">AuraPet</span>
        </div>

        <div className="vet-nav">
          {/* Menú lateral. "Inicio" es la pantalla principal; el resto abre modales */}
          <div className="vet-nav-item vet-nav-item--activo">
            <iconos.inicio size={18} />
            <span className="vet-nav-item-label">Inicio</span>
          </div>
          <div className="vet-nav-item" onClick={() => abrirAgenda("agenda")}>
            <iconos.calendario size={18} />
            <span className="vet-nav-item-label">Mi Agenda</span>
          </div>
          <div className="vet-nav-item" onClick={() => setModalAbierto("pacientes")}>
            <iconos.fichaMedica size={18} />
            <span className="vet-nav-item-label">Pacientes</span>
          </div>
          <div className="vet-nav-item" onClick = {() => setModalAbierto("receta")}>
            <iconos.receta size={18} />
            <span className="vet-nav-item-label">Recetas</span>
          </div>
          <div className="vet-nav-item" onClick={() => setModalAbierto("derivaciones")}>
            <iconos.derivacion size={18} />
            <span className="vet-nav-item-label">Derivaciones</span>
          </div>
          <div className="vet-nav-item" onClick={() => setModalAbierto("notas")}>
            <iconos.nota size={18} />
            <span className="vet-nav-item-label">Notas</span>
          </div>
          <div className="vet-nav-item" onClick={() => setModalAbierto("adopcion")}>
            <IconoAdopcion size={18} />
            <span className="vet-nav-item-label">{TEXTOS_DAR_EN_ADOPCION_PANEL.menu}</span>
          </div>
          <div className="vet-nav-item" onClick={() => setModalAbierto("configuracion")}>
            <iconos.configuracion size={18} />
            <span className="vet-nav-item-label">Configuración</span>
          </div>

          {/* Solo si administra algún centro */}
          {onAdministrarCentro && centrosAdmin.map((c) => (
            <div key={c.id} className="vet-nav-item" onClick={() => onAdministrarCentro(c.id)}>
              <iconos.centro size={18} />
              <span className="vet-nav-item-label">Administrar {c.nombre}</span>
            </div>
          ))}
        </div>
      </div>

      {/* pantalla principal */}
      <div className="vet-main">
        {/* circulito con el nombre de la persona en cuestión */}
        <div className="vet-topbar">
          <div className="vet-avatar">{getIniciales(usuarioActual!.nombre)}</div>
          <div className="vet-user-info">
            <span className="vet-user-name">{usuarioActual!.nombre}</span>
            <span className="vet-user-centro">{centroLabel}{usuarioActual!.esPrueba && " · Cuenta de prueba"}</span>
          </div>
        </div>

        {/* Cuenta aún no aprobada por el superadmin */}
        {enRevision && (
          <div className="vet-aviso-revision">
            <Aviso tipo="info" texto={TEXTOS_CENTRO_VETERINARIO.avisoRevision} />
          </div>
        )}

        <InicioVeterinario
          veterinarioId={veterinarioIdActual}
          nombre={usuarioActual!.nombre}
          recargaExterna={versionCitas}
          onVerPorConfirmar={() => abrirAgenda("por_confirmar")}
          onRecetar={(mascotaId) => {
            setPacienteParaReceta(mascotaId);
            setModalAbierto("receta");
          }}
        />
      </div>

      {modalAbierto === "agenda" && (
        <ModalAgenda
          veterinarioId={veterinarioIdActual}
          pestanaInicial={pestanaAgenda}
          onCerrar={() => setModalAbierto(null)}
          onCambio={() => setVersionCitas((n) => n + 1)}
        />
      )}
      {modalAbierto === "pacientes" && (
      <PacientesModal
        veterinarioId={veterinarioIdActual}
        onCerrar={() => setModalAbierto(null)}
        onRecetar={(mascotaId) => {
          setPacienteParaReceta(mascotaId);
          setModalAbierto("receta");
        }}
      />
      )}
      {modalAbierto === "receta" && (
      <RecetaModal 
        veterinarioId = {veterinarioIdActual}
        pacienteInicialId={pacienteParaReceta ?? undefined}
        nombreVeterinario={usuarioActual!.nombre}
        centro={infoVeterinario.centros[0]}
        onCerrar={() => { setModalAbierto(null); setPacienteParaReceta(null); }}
        />
      )}
      {modalAbierto === "derivaciones" && (
        <DerivacionesModal
          onCerrar={() => setModalAbierto(null)}
          onRecetar={(mascotaId) => {
            setPacienteParaReceta(mascotaId);
            setModalAbierto("receta");
          }}
        />
      )}
      {modalAbierto === "notas" && <NotasModal onCerrar={() => setModalAbierto(null)} />}
      {modalAbierto === "adopcion" && <DarEnAdopcionModal onCerrar={() => setModalAbierto(null)} />}
      {modalAbierto === "configuracion" && (
        <ConfiguracionModal onCerrar={() => setModalAbierto(null)} />
      )}
    </div>
  );
};
