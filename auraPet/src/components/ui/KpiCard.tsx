import type { KpiCardProps } from "../../interfaces";
import styles from "../../css/ui/KpiCard.module.css";

// =====================================================================
// KpiCard — tarjeta de indicador (KPI = "Key Performance Indicator",
// un número clave para ver de un vistazo cómo va algo).
//
// Se usa en el Resumen del superadmin: Usuarios activos, Centros activos,
// Veterinarios y Citas hoy (ver screens/SuperAdmin/ResumenSuperAdmin.tsx).
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
export const KpiCard = ({ icon, label, value, hint, cargando, onClick }: KpiCardProps) => (
  // Si recibe onClick, la tarjeta se puede apretar (p. ej. ir a la sección)
  <div
    className={`${styles.tarjeta} ${onClick ? styles.clickable : ""}`}
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
  >
    {/* Fila de arriba: ícono en un cuadradito verde suave + la etiqueta */}
    <div className={styles.cabecera}>
      <div className={styles.icono}>{icon}</div>
      <span className={styles.etiqueta}>{label}</span>
    </div>

    {/* Número principal. Mientras carga se muestra "–" en vez de un 0 que confunda */}
    <span className={styles.valor}>{cargando ? "–" : value}</span>

    {/* Línea de detalle: reserva su alto para que la tarjeta no "salte" al cargar */}
    <span className={styles.detalle}>{cargando ? "" : hint}</span>
  </div>
);
