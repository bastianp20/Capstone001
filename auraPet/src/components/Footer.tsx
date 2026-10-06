import { Link, NavLink } from "react-router-dom";
import { links } from "../constants";
import '../css/Contacto.css';
import '../css/NavBar.css';
import LogoAuraPetSinFondo from '../assets/logo/LogoAuraPetSinFondo.png'

const claseLink = ({ isActive }: { isActive: boolean }) =>
  isActive ? "landing-footer-link-activo" : "";

export const Footer = () => {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-col">
        <Link to="/" className="landing-navbar-logo">
          <img src={LogoAuraPetSinFondo} alt="AuraPet" className="landing-logo-icono" />
          <span>AuraPet</span>
        </Link>
        <p>Conectando dueños y veterinarias en un solo lugar.</p>
      </div>

      <div className="landing-footer-col">
        <h4>Navegación</h4>
        {/* "end" hace que Inicio solo quede activo en "/" exacto */}
        <NavLink to="/" end className={claseLink}>Inicio</NavLink>
        {links.map((link) => (
          <NavLink key={link.ruta} to={link.ruta} className={claseLink}>
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="landing-footer-col">
        <h4>Ayuda</h4>
        <Link to="/contacto">Soporte técnico</Link>
        <Link to="/como-funciona">Preguntas frecuentes</Link>
      </div>

      <div className="landing-footer-col">
        <h4>Social</h4>
        <div className="contacto-footer-social">
          <span>facebook</span>
          <span>instagram</span>
          <span>twitter</span>
          <span>youtube</span>
        </div>
      </div>

      <div className="landing-footer-bottom">
        © Copyright 2026. Derechos Reservados.
      </div>
    </footer>
  );
};