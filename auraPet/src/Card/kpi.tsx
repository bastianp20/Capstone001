
import type {KpiCardProps} from '../interfaces'; 
import {Colors} from '../constants'; 
const colors = Colors; 

export const KpiCard = ({ icon, label, value, hint }: KpiCardProps) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      background: "white",
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      padding: "16px 18px",
      flex: 1,
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: colors.accentSoft,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 12.5, color: colors.textMuted, fontWeight: 500 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>{value}</span>
        <span style={{ fontSize: 11.5, color: colors.textMuted }}>{hint}</span>
      </div>
    </div>
  </div>
);