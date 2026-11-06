import { MENU_DUENO } from "../../constants";
import type { MenuDuenoProps } from "../../interfaces";
import { filtrarMenuRefugio } from "../../lib/refugios";

// Menú lateral del dueño, armado desde MENU_DUENO (constants.ts).
// Las secciones cambian la pantalla; "Solicitar cita" y "Configuración" abren modales.
export const MenuDueno = ({ seccion, onElegir, conRefugio }: MenuDuenoProps) => (
  <nav className="dueno-nav">
    {filtrarMenuRefugio(MENU_DUENO, (i) => i.id, conRefugio).map(({ id, texto, icono: Icono }) => (
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
