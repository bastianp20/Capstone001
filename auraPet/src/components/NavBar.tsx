import { Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { links, RUTA_PANEL, TEXTO_MI_PANEL } from '../constants';
import { useAuth } from "../Auth/AuthContext";
import '../css/NavBar.css';
import logoAuraPet from '../assets/logo/LogoAuraPet.png';
import { useState } from "react";
import { LoginScreen } from "../screens/Login/LoginScreen";

export const NavBar = () => {
  const [login, setLogin] = useState(false);
  // Con sesión (por ejemplo, viendo /adopta desde un panel) el botón vuelve al panel
  const { usuarioActual } = useAuth();

  return (
    <>
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

      {usuarioActual ? (
        <Link to={RUTA_PANEL} className="landing-btn-primario">
          {TEXTO_MI_PANEL}
        </Link>
      ) : (
        <button className="landing-btn-primario" onClick={() => setLogin(true)}>
          Ingresar
        </button>
      )}
      <Menu className="landing-navbar-menu-icono" size={22} />
    </nav>

    {/* Fuera del <nav>: la barra usa backdrop-filter, y eso haría que el
        modal (position: fixed) se dibuje dentro de la barra en vez de en toda la pantalla */}
    {login && <LoginScreen onCerrar={() => setLogin(false)} />}
    </>
  );
};