import type { KpiCardProps } from "../interfaces";
import { Colors } from "../constants";
const colors = Colors;

// Tarjeta de indicador: ícono + etiqueta arriba, número grande y una línea de detalle.
export const KpiCard = ({ icon, label, value, hint, cargando }: KpiCardProps) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
      background: "white",
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      padding: "16px 18px",
      minWidth: 0,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: colors.accentSoft,
          color: colors.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>{label}</span>
    </div>

    <span style={{ fontSize: 28, fontWeight: 700, color: colors.text, lineHeight: 1, letterSpacing: -0.5 }}>
      {cargando ? "–" : value}
    </span>

    <span style={{ fontSize: 12, color: colors.textMuted, minHeight: 16 }}>{cargando ? "" : hint}</span>
  </div>
);
