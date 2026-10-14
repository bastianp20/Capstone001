import { MENU_DUENO } from "../../constants";
import type { MenuDuenoProps } from "../../interfaces";

// Menú lateral del dueño, armado desde MENU_DUENO (constants.ts).
// Las secciones cambian la pantalla; "Solicitar cita" y "Configuración" abren modales.
export const MenuDueno = ({ seccion, onElegir }: MenuDuenoProps) => (
  <nav className="dueno-nav">
    {MENU_DUENO.map(({ id, texto, icono: Icono }) => (
      <div
        key={id}
        className={`dueno-nav-item ${id === seccion ? "dueno-nav-item--activo" : ""}`}
        onClick={() => onElegir(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onElegir(id)}
      >
        <Icono size={18} />
        <span className="dueno-nav-item-label">{texto}</span>
      </div>
    ))}
  </nav>
);
