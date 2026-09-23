import type { CSSProperties } from 'react';
import { Colors, Iconos, Badge, badgeStyles, ESTADO_LABEL, URGENCIA_LABEL, EMOJI_ESPECIE,calcularEdad } from '../../constants';
import { getMascotasPorDueno, getProximasCitasDueno, getHistorialRecienteDueno } from '../../Api/getInfo';
import { getIniciales } from '../../utils';
import { useAuth } from '../../Auth/AuthContext';
import '../../css/duenoPage.css';

const colors = Colors;
const iconos = Iconos;

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

export const DuenoScreen = () => {
  const { usuarioActual } = useAuth();
  const duenoIdActual = usuarioActual!.id; // App.tsx ya garantiza que hay sesión antes de montar esta pantalla
  const nombreDueno = usuarioActual!.nombre;

  const mascotas = getMascotasPorDueno(duenoIdActual);
  const proximasCitas = getProximasCitasDueno(duenoIdActual).slice(0, 3);
  const historialReciente = getHistorialRecienteDueno(duenoIdActual, 3);
  return (
    <div className="dueno-page" style={temaVars}>
      <div className="dueno-sidebar">
        <div className="dueno-sidebar-brand">
          <iconos.huella size={22} color={colors.accent} />
          <span className="dueno-sidebar-brand-name">AuraPet</span>
        </div>

        <div className="dueno-nav">
          <div className="dueno-nav-item dueno-nav-item--activo">
            <iconos.inicio size={18} />
            <span className="dueno-nav-item-label">Inicio</span>
          </div>
          <div className="dueno-nav-item">
            <iconos.huella size={18} />
            <span className="dueno-nav-item-label">Mis Mascotas</span>
          </div>
          <div className="dueno-nav-item">
            <iconos.solicitarCita size={18} />
            <span className="dueno-nav-item-label">Solicitar Cita</span>
          </div>
          <div className="dueno-nav-item">
            <iconos.historial size={18} />
            <span className="dueno-nav-item-label">Historial Médico</span>
          </div>
          <div className="dueno-nav-item">
            <iconos.configuracion size={18} />
            <span className="dueno-nav-item-label">Configuración</span>
          </div>
        </div>
      </div>

      <div className="dueno-main">
        <div className="dueno-topbar">
          <div className="dueno-buscador">
            <iconos.buscar size={15} color={colors.textMuted} />
            <input type="text" placeholder="Buscar mascota, cita o veterinario…" />
          </div>
          <div className="dueno-topbar-right">
            <span>
              <iconos.notificaciones size={19} color={colors.textMuted} />
            </span>
            <div className="dueno-usuario">
              <div className="dueno-avatar">{getIniciales(nombreDueno)}</div>
              <div className="dueno-usuario-info">
                <span className="dueno-usuario-nombre">{nombreDueno}</span>
                <span className="dueno-usuario-rol">Dueñ@</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dueno-content">
          <div className="dueno-content-header">
            <div>
              <h1 className="dueno-content-titulo">Hola, {nombreDueno.split(" ")[0]} 👋</h1>
              <p className="dueno-content-subtitulo">Esto es lo que está pasando con tus mascotas</p>
            </div>
            <div className="dueno-acciones-rapidas">
              {/* TODO: abre RegistrarMascotaModal (próxima capa) */}
              <button className="dueno-btn dueno-btn--secundario">
                <iconos.agregar size={15} />
                Registrar mascota
              </button>
              {/* TODO: abre SolicitarCitaModal (próxima capa) */}
              <button className="dueno-btn dueno-btn--primario">
                <iconos.solicitarCita size={15} />
                Solicitar cita
              </button>
            </div>
          </div>

          <section className="dueno-seccion">
            <div className="dueno-seccion-header">
              <h2 className="dueno-seccion-titulo">Mis mascotas</h2>
              <a className="dueno-seccion-link">Ver todas →</a>
            </div>
            <div className="dueno-mascotas-grid">
              {mascotas.map((m) => (
                <div key={m.id} className="dueno-mascota-card">
                  <div className="dueno-mascota-top">
                    <div className="dueno-mascota-avatar">{EMOJI_ESPECIE[m.especie]}</div>
                    <div>
                      <p className="dueno-mascota-nombre">{m.nombre}</p>
                      <p className="dueno-mascota-detalle">
                        {m.raza} · {calcularEdad(m.fechaNacimiento)} años
                      </p>
                    </div>
                  </div>
                  <div className="dueno-mascota-tags">
                    <span className={`dueno-tag ${m.esterilizado ? "dueno-tag--ok" : ""}`}>
                      {m.esterilizado ? "Esterilizado" : "Sin esterilizar"}
                    </span>
                    <span className="dueno-tag">{m.sexo === "macho" ? "Macho" : "Hembra"}</span>
                  </div>
                </div>
              ))}

              <div className="dueno-mascota-card-add">
                <iconos.agregar size={22} />
                <span>Agregar mascota</span>
              </div>
            </div>
          </section>

          <div className="dueno-dos-columnas">
            <section className="dueno-panel">
              <div className="dueno-panel-header">Próximas citas</div>

              {proximasCitas.length === 0 && (
                <div className="dueno-panel-vacio">No tienes citas agendadas.</div>
              )}

              {proximasCitas.map((c) => (
                <div key={c.id} className="dueno-cita-fila">
                  <div className="dueno-cita-fecha">
                    <span className="dueno-cita-fecha-dia">{c.dia}</span>
                    <span className="dueno-cita-fecha-mes">{c.mes}</span>
                  </div>
                  <div className="dueno-cita-info">
                    <div className="dueno-cita-mascota">{c.mascota}</div>
                    <div className="dueno-cita-motivo">
                      {c.centro} — <span>{c.motivo}</span>
                    </div>
                  </div>
                  <div className="dueno-cita-badges">
                    <span style={Badge(badgeStyles[c.estado])}>{ESTADO_LABEL[c.estado]}</span>
                    <span style={Badge(badgeStyles[c.urgencia])}>{URGENCIA_LABEL[c.urgencia]}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="dueno-panel">
              <div className="dueno-panel-header">Historial reciente</div>
              <div className="dueno-historial-lista">
                {historialReciente.length === 0 && (
                  <div className="dueno-panel-vacio">Aún no hay historial médico.</div>
                )}
                {historialReciente.map((h) => (
                  <div key={h.id} className="dueno-historial-item">
                    <div className="dueno-historial-linea">
                      <div className="dueno-historial-punto" />
                      <div className="dueno-historial-hilo" />
                    </div>
                    <div className="dueno-historial-texto">
                      <div className="dueno-historial-desc">{h.descripcion}</div>
                      <div className="dueno-historial-meta">{h.mascota} · {h.fecha}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};