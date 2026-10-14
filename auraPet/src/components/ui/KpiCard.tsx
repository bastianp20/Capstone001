import type { KpiCardProps } from "../../interfaces";
import { Colors } from "../../constants";
const colors = Colors;

// =====================================================================
// KpiCard — tarjeta de indicador (KPI = "Key Performance Indicator",
// un número clave para ver de un vistazo cómo va algo).
//
// Se usa en el Resumen del superadmin: Usuarios activos, Centros activos,
// Veterinarios y Citas hoy (ver screens/SuperAdmin/SuperAdminScreen.tsx).
//
// Cómo se ve, de arriba a abajo:
//   [ícono]  Etiqueta          ← icon + label
//   48                         ← value (número grande)
//   9 dueños · 4 veterinarios  ← hint (línea de detalle, opcional)
//
// Props (ver KpiCardProps en interfaces.ts):
//   · icon:     ícono de lucide, por ejemplo <iconos.usuarios size={17} />
//   · label:    texto de arriba ("Usuarios activos")
//   · value:    el número o texto principal
//   · hint:     detalle bajo el número (puede ser texto o JSX, p. ej. en rojo)
//   · cargando: mientras llegan los datos muestra "–" y oculta el detalle,
//               para no mostrar un 0 falso
//
// Parecido a components/ui/Indicador.tsx, pero con ícono y línea de detalle.
// =====================================================================
export const KpiCard = ({ icon, label, value, hint, cargando }: KpiCardProps) => (
  // Caja blanca con borde suave. minWidth: 0 evita que un texto largo
  // estire la tarjeta y rompa la grilla donde va.
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
    {/* Fila de arriba: ícono en un cuadradito verde suave + la etiqueta */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: colors.accentSoft,
          color: colors.accent, // el ícono toma este color (lucide usa currentColor)
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,        // el cuadradito nunca se achica
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>{label}</span>
    </div>

    {/* Número principal. Mientras carga se muestra "–" en vez de un 0 que confunda */}
    <span style={{ fontSize: 28, fontWeight: 700, color: colors.text, lineHeight: 1, letterSpacing: -0.5 }}>
      {cargando ? "–" : value}
    </span>

    {/* Línea de detalle. minHeight reserva su espacio para que la tarjeta
        no "salte" de alto cuando terminan de llegar los datos */}
    <span style={{ fontSize: 12, color: colors.textMuted, minHeight: 16 }}>{cargando ? "" : hint}</span>
  </div>
);
