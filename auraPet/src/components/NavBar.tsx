import { Menu } from "lucide-react";
import { links } from '../constants';
import '../css/NavBar.css';
import type { NavbarProps } from '../interfaces';

export const NavBar = ({ vistaActiva, onNavegar, onIngresar }: NavbarProps) => {
  return (
    <nav className="landing-navbar">
      <div
        className="landing-navbar-logo"
        onClick={() => onNavegar?.("landing")}
        style={{ cursor: "pointer" }}
      >
        <span className="landing-logo-icono">🐾</span>
        <span>AuraPet</span>
      </div>

      <div className="landing-navbar-links">
        {links.map((link) => (
          <a
            key={link.vista}
            href={`#${link.vista}`}
            className={vistaActiva === link.vista ? "landing-navbar-link-activo" : ""}
            onClick={(e) => {
              e.preventDefault();
              onNavegar?.(link.vista);
            }}
          >
            {link.label}
          </a>
        ))}
        {/* TODO: "Contacto" todavía no tiene su propia vista, queda como ancla suelta */}
        <a href="#contacto">Contacto</a>
      </div>

      <button className="landing-btn-primario" onClick={onIngresar}>
        Ingresar
      </button>
      <Menu className="landing-navbar-menu-icono" size={22} />
    </nav>
  );
};
