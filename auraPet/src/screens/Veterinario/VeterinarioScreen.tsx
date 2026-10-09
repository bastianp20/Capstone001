import { useState, type CSSProperties } from 'react';
import { Colors, Iconos } from '../../constants';
import { getInfoVeterinario } from '../../Api/getInfo';
import { useConsulta } from '../../hooks/useConsulta';
import { ModalAgenda } from '../../Modal/AgendaModal';
import {PacientesModal} from '../../Modal/PacientesModal'; 
import type { NuevaReceta } from '../../interfaces';
import '../../css/VeterinariosPage.css';
import { RecetaModal } from '../../Modal/RecetasModal';
import { ConfiguracionModal } from '../../Modal/ConfiguracionModal';
import { useAuth } from '../../Auth/AuthContext';

const colors = Colors;
const iconos = Iconos;

// Variables CSS con los colores del tema (Colors, en constants.ts es la
// única fuente de verdad) para que VeterinariosPage.css los use como
// var(--color-*) en vez de tener los hex duplicados en dos lugares.
const temaVars = {
  "--color-bg": colors.bg,
  "--color-sidebar-bg": colors.sidebarBg,
  "--color-sidebar-active": colors.sidebarActive,
  "--color-border": colors.border,
  "--color-text": colors.text,
  "--color-text-muted": colors.textMuted,
  "--color-accent": colors.accent,
  "--color-accent-soft": colors.accentSoft,
} as CSSProperties;

export const VeterinarioScreen = () => {
  const { usuarioActual } = useAuth();

  // Ficha de veterinario de esta cuenta (id de la tabla veterinarios + centros).
  // La agenda y los pacientes usan ese id, no el de la cuenta.
  const { datos: infoVeterinario = { id: null, centros: [] } } =
    useConsulta(() => getInfoVeterinario(usuarioActual!.id), [usuarioActual!.id]);
  // -1 mientras carga o si la cuenta todavía no tiene ficha profesional: las consultas devuelven [].
  const veterinarioIdActual = infoVeterinario.id ?? -1;

  // Un veterinario puede no estar vinculado a ningún centro (atención
  // independiente): en ese caso centros llega vacío y lo indicamos así,
  // en vez de mostrar un nombre de centro que no corresponde.
  const centroLabel =
    infoVeterinario.centros.length > 0
      ? infoVeterinario.centros.join(" · ")
      : "Atención independiente (sin centro asignado)";

  // Controla qué modal está abierto. Por ahora solo existe el de agenda;
  // cuando armemos Historial/Recetas se suman como más valores posibles
  // ("historial" | "recetas" | ...) en vez de un booleano por modal.
  const [modalAbierto, setModalAbierto] = useState<"agenda" | "pacientes" | "receta" | "configuracion" | null>(null);

  // esto es para el avatar, que ocupe las iniciales de la persona cuando no hay foto de perfil cargada. 
  const getIniciales = (nombreCompleto: string): string => {
    const partes = nombreCompleto.trim().split(" ");
    const primera = partes[0]?.charAt(0) ?? "";
    const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : "";
    return (primera + ultima).toUpperCase();
  };

  return (
    <div className="vet-page" style={temaVars}>
      {/* logo y nombre de la página */}
      <div className="vet-sidebar">
        <div className="vet-sidebar-brand">
          <iconos.huella size={22} color={colors.accent} />
          <span className="vet-sidebar-brand-name">AuraPet</span>
        </div>

        <div className="vet-nav">
          {/* Menú lateral */}
          <div className="vet-nav-item" onClick={() => setModalAbierto("agenda")}>
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
          <div className="vet-nav-item" onClick={() => setModalAbierto("configuracion")}>
            <iconos.configuracion size={18} />
            <span className="vet-nav-item-label">Configuración</span>
          </div>
        </div>
      </div>

      {/* pantalla principal */}
      <div className="vet-main">
        {/* circulito con el nombre de la persona en cuestión */}
        <div className="vet-topbar">
          <div className="vet-avatar">{getIniciales(usuarioActual!.nombre)}</div>
          <div className="vet-user-info">
            <span className="vet-user-name">{usuarioActual!.nombre}</span>
            <span className="vet-user-centro">{centroLabel}</span>
          </div>
        </div>
      </div>

      {modalAbierto === "agenda" && (
        <ModalAgenda veterinarioId={veterinarioIdActual} onCerrar={() => setModalAbierto(null)} />
      )}
      {modalAbierto === "pacientes" && (
      <PacientesModal veterinarioId={veterinarioIdActual} onCerrar={() => setModalAbierto(null)} />
      )}
      {modalAbierto === "receta" && (
      <RecetaModal 
        veterinarioId = {veterinarioIdActual}
        onCerrar={() => setModalAbierto(null)}
        onGuardar={(receta: NuevaReceta) => {
          console.log('receta guardada Master :p ', receta)
        }
        }/>
      )}
      {modalAbierto === "configuracion" && (
        <ConfiguracionModal onCerrar={() => setModalAbierto(null)} />
      )}
    </div>
  );
};
