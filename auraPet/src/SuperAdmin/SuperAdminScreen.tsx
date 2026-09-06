import { useState } from "react";
import type {SolicitudPendiente} from '../interfaces'; 
import {solicitudesPendientesMock, citasMock} from '../Data/DatosFalsos'; 
import {Colors, Badge, badgeStyles, ESTADO_LABEL, URGENCIA_LABEL} from '../constants'; 
import {RechazarModal} from '../components/Modal'; 
import { KpiCard } from "../Card/kpi";

const colors = Colors; 
const badge = Badge; 

// ---------- Vista principal ----------

export const SuperAdminScreen = () => {
  const [solicitudes, setSolicitudes] = useState(solicitudesPendientesMock);
  const [solicitudARechazar, setSolicitudARechazar] = useState<SolicitudPendiente | null>(null);

  const aprobar = (id: string) => {
    // TODO: llamar a la API/Supabase para marcar la solicitud como aprobada
    setSolicitudes((prev) => prev.filter((s) => s.id !== id));
  };

  const confirmarRechazo = (razon: string) => {
    if (!solicitudARechazar) return;
    // TODO: llamar a la API/Supabase enviando { id: solicitudARechazar.id, razon }
    setSolicitudes((prev) => prev.filter((s) => s.id !== solicitudARechazar.id));
    setSolicitudARechazar(null);
  };

  const navItems = [
    { label: "Resumen", active: true },
    { label: "Usuarios", active: false },
    { label: "Centros y veterinarios", active: false },
    { label: "Aprobaciones", active: false },
    { label: "Citas", active: false },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.bg, fontFamily: "system-ui, sans-serif" }}>
      {/* SIDEBAR */}
      <div style={{ width: 236, flexShrink: 0, background: colors.sidebarBg, display: "flex", flexDirection: "column", padding: "20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 22px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: colors.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
            🐾
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>AuraPet</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => (
            <div
              key={item.label}
              style={{
                padding: "10px 12px",
                borderRadius: 9,
                fontSize: 13.5,
                fontWeight: 500,
                cursor: "pointer",
                color: item.active ? "white" : colors.sidebarText,
                background: item.active ? colors.sidebarActive : "transparent",
              }}
            >
              {item.label}
            </div>
          ))}
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
              background: colors.bg,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 18 }}>🔔</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 999, background: colors.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: colors.accent }}>
                SA
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: colors.text }}>SuperAdmin</span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: "26px 28px", overflowY: "auto" }}>
          <h1 style={{ margin: "0 0 18px", fontSize: 21, fontWeight: 700, color: colors.text }}>Resumen General</h1>

          {/* KPIs */}
          <div style={{ display: "flex", gap: 14, marginBottom: 22 }}>
            <KpiCard icon="👥" label="Usuarios activos" value="1,248" hint="+5.2% vs. mes pasado" />
            <KpiCard icon="🏥" label="Centros activos" value="45" hint="Nuevos: 2" />
            <KpiCard icon="🩺" label="Veterinarios verificados" value="112" hint="96.5% verif." />
            <KpiCard icon="📅" label="Citas hoy" value="89" hint="21 urgentes, 6 críticas" />
          </div>

          {/* Solicitudes pendientes */}
          <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, marginBottom: 22, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${colors.border}`, fontSize: 14.5, fontWeight: 700 }}>
              Solicitudes pendientes (aprobaciones)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1.2fr 1.4fr 1.6fr", padding: "10px 18px", background: colors.bg, fontSize: 11.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>
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
                <div style={{ display: "flex", gap: 14 }}>
                  <button
                    onClick={() => aprobar(s.id)}
                    style={{ border: "none", background: "none", color: colors.accent, fontWeight: 600, fontSize: 13, cursor: "pointer", padding: 0 }}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => setSolicitudARechazar(s)}
                    style={{ border: "none", background: "none", color: "#a4272a", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: 0 }}
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
              Citas recientes y próximas
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr 1.4fr 1.2fr 1fr 1fr", padding: "10px 18px", background: colors.bg, fontSize: 11.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>
              <span>Mascota / Dueño</span>
              <span>Veterinario</span>
              <span>Centro</span>
              <span>Fecha/Hora</span>
              <span>Estado</span>
              <span>Urgencia</span>
            </div>
            {citasMock.map((c) => (
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
    </div>
  );
};
