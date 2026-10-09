import { Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { links } from '../constants';
import '../css/NavBar.css';
import logoAuraPet from '../assets/logo/LogoAuraPet.png';
import { useState } from "react";
import { LoginScreen } from "../screens/Login/LoginScreen";

export const NavBar = () => {
  const [login, setLogin] = useState(false);

  return (
    <nav className="landing-navbar">
      <Link to="/" className="landing-navbar-logo">
        <img src={logoAuraPet} alt="AuraPet" className="landing-logo-icono" />
        <span>AuraPet</span>
      </Link>

      <div className="landing-navbar-links">
        {/* Las páginas se agregan o cambian en "links" de constants.ts */}
        {links.map((link) => (
          <NavLink
            key={link.ruta}
            to={link.ruta}
            className={({ isActive }) => (isActive ? "landing-navbar-link-activo" : "")}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <button className="landing-btn-primario" onClick={() => setLogin(true)}>
        Ingresar
      </button>
      <Menu className="landing-navbar-menu-icono" size={22} />
      {login && <LoginScreen onCerrar={() => setLogin(false)} />}
    </nav>
  );
};