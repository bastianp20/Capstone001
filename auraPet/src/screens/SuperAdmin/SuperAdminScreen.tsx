import { useEffect, useState } from "react";
import type {SolicitudPendiente} from '../../interfaces';
import {Colors, Badge, badgeStyles, ESTADO_LABEL, URGENCIA_LABEL} from '../../constants';
import {RechazarModal} from '../../Modal/ReachazarModal';
import { KpiCard } from "../../components/ui/KpiCard";
import { getCitasResumen, getResumenSuperadmin, getSolicitudesPendientes } from "../../Api/getInfo";
import { resolverSolicitud } from "../../Api/postInfo";
import { useConsulta } from "../../hooks/useConsulta";
import { useAuth } from "../../Auth/AuthContext";
import { ConfiguracionModal } from "../../Modal/ConfiguracionModal";
import { Iconos } from "../../constants";

import { ModalCrearProfesional } from "../../Modal/CrearProfesionalModal";
import { ModalCrearDueno } from "../../Modal/CrearDuenoModal";
import { ModalCrearSuperadmin } from "../../Modal/CrearSuperadminModal";
import { ModalCrearCentro } from "../../Modal/CrearCentroModal";
import { ModalCrearAdministrativo } from "../../Modal/CrearAdministrativoModal";
import { CentrosVeterinarios } from "./CentrosVeterinarios";
import { ListaCentros } from "./ListaCentros";
import LogoAuraPetSinFondo from '../../assets/logo/LogoAuraPetSinFondo.png'; 
import { ResumenUsuarios } from "./ResumenUsuarios";

const colors = Colors;
const badge = Badge;
const iconos = Iconos;
const FONDO = "#f6f8f8"; // gris tirado para blanco 
const ROJO = "#a4272a";

type ModalCrear = "profesional" | "superadmin" | "centro" | "dueno" | "administrativo" | null;

export const SuperAdminScreen = () => {
  const { usuarioActual } = useAuth();
  const [solicitudARechazar, setSolicitudARechazar] = useState<SolicitudPendiente | null>(null);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);

  // Menú "+ Crear" y cuál modal de creación está abierto
  const [menuCrearAbierto, setMenuCrearAbierto] = useState(false);
  const [modalCrear, setModalCrear] = useState<ModalCrear>(null);

  const opcionesCrear = [
    { tipo: "profesional", label: "Cuenta profesional", Icono: iconos.diagnostico },
    { tipo: "dueno", label: "Cuenta dueño", Icono: iconos.huella },
    { tipo: "administrativo", label: "Cuenta administrativa", Icono: iconos.centro },
    { tipo: "superadmin", label: "Cuenta superadmin", Icono: iconos.permisos },
    { tipo: "centro", label: "Agregar centro", Icono: iconos.centro },
  ] as const;

  const abrirModalCrear = (tipo: ModalCrear) => {
    setModalCrear(tipo);
    setMenuCrearAbierto(false);
  };

  // Al cerrar un modal de crear, volvemos a pedir los datos para que los números se actualicen.
  const [recarga, setRecarga] = useState(0);
  const recargar = () => setRecarga((n) => n + 1);
  const cerrarModalCrear = () => {
    setModalCrear(null);
    recargar();
  };

  // Números reales de las tarjetas
  const { datos: resumen, cargando: cargandoResumen } = useConsulta(() => getResumenSuperadmin(), [recarga]);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  // Solicitudes: se guardan en estado propio porque aprobar/rechazar las saca de la lista.
  const [solicitudes, setSolicitudes] = useState<SolicitudPendiente[]>([]);
  useEffect(() => {
    getSolicitudesPendientes()
      .then(setSolicitudes)
      .catch((e) => console.error("No se pudieron cargar las solicitudes:", e));
  }, [recarga]);
  // Citas de toda la plataforma (solo lectura).
  const { datos: citas = [] } = useConsulta(() => getCitasResumen(), [recarga]);

  // Secciones del menú lateral. Las que aún no existen quedan deshabilitadas.
  type Seccion = "resumen" | "usuarios" | "centros" | "asignaciones";
  const [seccion, setSeccion] = useState<Seccion>("resumen");
  const navItems: { label: string; seccion: Seccion | null }[] = [
    { label: "Resumen", seccion: "resumen" },
    { label: "Usuarios", seccion: "usuarios" },
    { label: "Centros", seccion: "centros" },
    { label: "Centros y veterinarios", seccion: "asignaciones" },
    { label: "Aprobaciones", seccion: null },
    { label: "Citas", seccion: null },
  ];
  // Rechazar: guarda el motivo en la base y saca la solicitud de la lista.
  const confirmarRechazo = async (razon: string) => {
    if (!solicitudARechazar || !usuarioActual) return;
    try {
      await resolverSolicitud(solicitudARechazar.id, "rechazado", usuarioActual.id, razon);
      setSolicitudARechazar(null);
      setErrorAccion(null);
      recargar();
    } catch (e) {
      setErrorAccion(e instanceof Error ? e.message : "No se pudo rechazar la solicitud.");
      setSolicitudARechazar(null);
    }
  };

  // Aprobar: el centro o veterinario queda verificado y visible.
  const aprobar = async (id: string) => {
    if (!usuarioActual) return;
    try {
      await resolverSolicitud(id, "aprobado", usuarioActual.id);
      setErrorAccion(null);
      recargar();
    } catch (e) {
      setErrorAccion(e instanceof Error ? e.message : "No se pudo aprobar la solicitud.");
    }
  };

  // Iniciales para el avatar: "Alan Penroz" -> "AP"
  const iniciales = (usuarioActual?.nombre ?? "Superadmin")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: FONDO, fontFamily: "system-ui, sans-serif" }}>
      {/* SIDEBAR */}
      <div style={{ width: 236, flexShrink: 0, background: colors.sidebarBg, display: "flex", flexDirection: "column", padding: "20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 22px" }}>
          <img src={LogoAuraPetSinFondo} alt="Logo AuraPet" style={{ width: 30, height: 30 }} />
          <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>AuraPet</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => {
            const activo = item.seccion === seccion;
            return (
              <div
                key={item.label}
                onClick={() => item.seccion && setSeccion(item.seccion)}
                title={item.seccion ? undefined : "Próximamente"}
                style={{
                  padding: "10px 12px",
                  borderRadius: 9,
                  fontSize: 13.5,
                  fontWeight: 500,
                  cursor: item.seccion ? "pointer" : "default",
                  color: activo ? "white" : colors.sidebarText,
                  background: activo ? colors.sidebarActive : "transparent",
                  opacity: item.seccion ? 1 : 0.5,
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* TOPBAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 28px",
            background: "white",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <input
            type="text"
            placeholder="Buscar en AuraPet…"
            style={{
              flex: 1,
              maxWidth: 420,
              padding: "9px 14px",
              borderRadius: 9,
              border: `1px solid ${colors.border}`,
              fontSize: 13.5,
              background: FONDO,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Botón + Crear con su menú */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMenuCrearAbierto((abierto) => !abierto)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 9, border: "none", background: colors.accent, color: "white", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
              >
                <iconos.agregar size={16} />
                Crear
                <iconos.flechaAbajo size={15} />
              </button>

              {menuCrearAbierto && (
                <>
                  {/* Capa invisible: un clic fuera del menú lo cierra */}
                  <div onClick={() => setMenuCrearAbierto(false)} style={{ position: "fixed", inset: 0, zIndex: 20 }} />

                  <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 21, minWidth: 220, background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, boxShadow: "0 12px 30px rgba(0,0,0,0.12)", padding: 6 }}>
                    {opcionesCrear.map(({ tipo, label, Icono }) => (
                      <button
                        key={tipo}
                        onClick={() => abrirModalCrear(tipo)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = colors.accentSoft)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", border: "none", background: "none", borderRadius: 8, fontSize: 13.5, color: colors.text, cursor: "pointer", textAlign: "left" }}
                      >
                        <Icono size={17} color={colors.accent} />
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <iconos.notificaciones size={18} color={colors.textMuted} style={{ cursor: "pointer" }} />
            <iconos.configuracion
              size={18}
              color={colors.textMuted}
              style={{ cursor: "pointer" }}
              onClick={() => setMostrarConfiguracion(true)}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 999, background: colors.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: colors.accent }}>
                {iniciales}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: colors.text }}>{usuarioActual?.nombre ?? "SuperAdmin"}</span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: "26px 28px", overflowY: "auto" }}>
          {seccion === "centros" ? (
            <ListaCentros />
          ) : seccion === "asignaciones" ? (
            <CentrosVeterinarios />
          ) : seccion === "usuarios" ? (
            <ResumenUsuarios />
          ) : (
          <>
          <h1 style={{ margin: "0 0 18px", fontSize: 21, fontWeight: 700, color: colors.text }}>Resumen</h1>

          {/* KPIs: números reales desde Supabase */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 22 }}>
            <KpiCard
              icon={<iconos.usuarios size={17} />}
              label="Usuarios activos"
              value={resumen?.usuarios.total ?? 0}
              cargando={cargandoResumen}
              hint={resumen && `${resumen.usuarios.duenos} dueños · ${resumen.usuarios.veterinarios} veterinarios · ${resumen.usuarios.superadmins} superadmin`}
            />
            <KpiCard
              icon={<iconos.centro size={17} />}
              label="Centros activos"
              value={resumen?.centros.activos ?? 0}
              cargando={cargandoResumen}
              hint={resumen && (resumen.centros.dePrueba > 0 ? `${resumen.centros.dePrueba} de pruebas` : "Ninguno de pruebas")}
            />
            <KpiCard
              icon={<iconos.diagnostico size={17} />}
              label="Veterinarios"
              value={resumen?.veterinarios.total ?? 0}
              cargando={cargandoResumen}
              hint={resumen && `${resumen.veterinarios.verificados} verificados · ${resumen.veterinarios.pendientes} pendientes`}
            />
            <KpiCard
              icon={<iconos.calendario size={17} />}
              label="Citas hoy"
              value={resumen?.citasHoy.total ?? 0}
              cargando={cargandoResumen}
              hint={
                resumen &&
                (resumen.citasHoy.urgentes > 0 ? (
                  <span style={{ color: ROJO }}>{resumen.citasHoy.urgentes} urgentes</span>
                ) : (
                  "Sin urgencias"
                ))
              }
            />
          </div>

          {errorAccion && (
            <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "#fdecec", color: ROJO, fontSize: 13 }}>
              {errorAccion}
            </div>
          )}

          {/* Solicitudes pendientes */}
          <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, marginBottom: 22, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${colors.border}`, fontSize: 14.5, fontWeight: 700 }}>
              Solicitudes pendientes
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1.2fr 1.4fr 1.6fr", padding: "10px 18px", background: FONDO, fontSize: 11.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>
              <span>Solicitud</span>
              <span>Tipo</span>
              <span>Fecha de registro</span>
              <span>Acciones</span>
            </div>
            {solicitudes.length === 0 && (
              <div style={{ padding: "24px 18px", textAlign: "center", color: colors.textMuted, fontSize: 13 }}>
                No hay solicitudes pendientes.
              </div>
            )}
            {solicitudes.map((s) => (
              <div key={s.id} style={{ display: "grid", gridTemplateColumns: "2.4fr 1.2fr 1.4fr 1.6fr", alignItems: "center", padding: "13px 18px", borderTop: `1px solid ${colors.border}` }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{s.nombre}</span>
                <span style={{ fontSize: 13, color: colors.textMuted, textTransform: "capitalize" }}>{s.tipo}</span>
                <span style={{ fontSize: 13, color: colors.textMuted }}>{s.fechaRegistro}</span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    onClick={() => aprobar(s.id)}
                    style={{ border: "none", background: colors.accentSoft, color: colors.accent, fontWeight: 600, fontSize: 12.5, cursor: "pointer", padding: "6px 12px", borderRadius: 999 }}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => setSolicitudARechazar(s)}
                    style={{ border: "none", background: "none", color: ROJO, fontWeight: 600, fontSize: 12.5, cursor: "pointer", padding: "6px 4px" }}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Citas recientes y próximas */}
          <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${colors.border}`, fontSize: 14.5, fontWeight: 700 }}>
              Citas
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr 1.4fr 1.2fr 1fr 1fr", padding: "10px 18px", background: FONDO, fontSize: 11.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>
              <span>Mascota / Dueño</span>
              <span>Veterinario</span>
              <span>Centro</span>
              <span>Fecha/Hora</span>
              <span>Estado</span>
              <span>Urgencia</span>
            </div>
            {citas.length === 0 && (
              <div style={{ padding: "24px 18px", textAlign: "center", color: colors.textMuted, fontSize: 13 }}>
                Todavía no hay citas registradas.
              </div>
            )}
            {citas.map((c) => (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr 1.4fr 1.2fr 1fr 1fr", alignItems: "center", padding: "13px 18px", borderTop: `1px solid ${colors.border}` }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{c.mascota}</span>
                  <span style={{ fontSize: 12, color: colors.textMuted }}>{c.dueno}</span>
                </div>
                <span style={{ fontSize: 13, color: colors.textMuted }}>{c.veterinario}</span>
                <span style={{ fontSize: 13, color: colors.textMuted }}>{c.centro}</span>
                <span style={{ fontSize: 13, color: colors.textMuted }}>{c.fechaHora}</span>
                <span style={badge(badgeStyles[c.estado])}>{ESTADO_LABEL[c.estado]}</span>
                <span style={badge(badgeStyles[c.urgencia])}>{URGENCIA_LABEL[c.urgencia]}</span>
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      </div>
            {/* Éste es el modal de rechazo */}
      {solicitudARechazar && (
        <RechazarModal
          nombreSolicitud={solicitudARechazar.nombre}
          onCancelar={() => setSolicitudARechazar(null)}
          onConfirmar={confirmarRechazo}
        />
      )}
      {mostrarConfiguracion && (
        <ConfiguracionModal onCerrar={() => setMostrarConfiguracion(false)} />
      )}
      {modalCrear === "profesional" && (
        <ModalCrearProfesional onClose={cerrarModalCrear} />
      )}
      {modalCrear === "dueno" && (
        <ModalCrearDueno onClose={cerrarModalCrear} />
      )}
      {modalCrear === "superadmin" && (
        <ModalCrearSuperadmin onClose={cerrarModalCrear} />
      )}
      {modalCrear === "centro" && (
        <ModalCrearCentro onClose={cerrarModalCrear} />
      )}
      {modalCrear === "administrativo" && (
        <ModalCrearAdministrativo onClose={cerrarModalCrear} />
      )}
    </div>
  );
};
