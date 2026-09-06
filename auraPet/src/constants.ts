import type { CSSProperties } from "react";
import type {EstadoCita, UrgenciaCita} from '../src/interfaces'; 
export const Colors = {
  bg: "#f4f5f7",
  sidebarBg: "#12181f",
  sidebarActive: "#0f8f80",
  sidebarText: "#b8c1cc",
  border: "#e4e6ea",
  text: "#1a1f27",
  textMuted: "#6b7280",
  accent: "#0f8f80",
  accentSoft: "#e3f5f2",
};

export const badgeStyles: Record<string, CSSProperties> = {
  // estado de cita
  confirmada: { background: "#e3edfb", color: "#2452a8" },
  en_curso: { background: "#dff3ea", color: "#177a4f" },
  cancelada: { background: "#fbe4e4", color: "#a4272a" },
  pendiente: { background: "#eceef1", color: "#4b5563" },
  completada: { background: "#dff3ea", color: "#177a4f" },
  // urgencia
  critica: { background: "#e0403f", color: "#ffffff" },
  alta: { background: "#f4a13a", color: "#5a3600" },
  media: { background: "#f0d251", color: "#5a4b00" },
  baja: { background: "#dff3ea", color: "#177a4f" },
};

export const ESTADO_LABEL: Record<EstadoCita, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  en_curso: "En curso",
  completada: "Completada",
  cancelada: "Cancelada",
};

export const URGENCIA_LABEL: Record<UrgenciaCita, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Urgente",
  critica: "Crítica",
};

export const Badge = (style: CSSProperties): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
  ...style,
});