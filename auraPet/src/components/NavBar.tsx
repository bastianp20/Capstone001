import { Menu } from "lucide-react";
import { links } from '../constants';
import '../css/NavBar.css';
import type { NavbarProps } from '../interfaces';
import logoAuraPet from '../assets/LogoAuraPet.png'; 
import { useState } from "react";
import { LoginScreen } from "../screens/Login/LoginScreen";

export const NavBar = ({ vistaActiva, onNavegar}: NavbarProps) => {

  const [login, setLogin] = useState(false); 
  return (
    <nav className="landing-navbar">
      <div
        className="landing-navbar-logo"
        onClick={() => onNavegar?.("landing")}
        style={{ cursor: "pointer" }}
      >
       <img src={logoAuraPet} alt="AuraPet" className="landing-logo-icono" />
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

      <button className="landing-btn-primario" onClick = {() => setLogin(true)}>
        Ingresar
      </button>
      <Menu className="landing-navbar-menu-icono" size={22} />
      {login && <LoginScreen onCerrar={() => setLogin(false)} />}
    </nav>
    
  );
};
