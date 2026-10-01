import type { FooterProps, VistaHome } from "../interfaces";
import '../css/Contacto.css'; 
import '../css/NavBar.css';
import LogoAuraPetSinFondo from '../assets/logo/LogoAuraPetSinFondo.png'


export const Footer = ({ vistaActiva, onNavegar }: FooterProps) => {
  const irA = (vista: VistaHome) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavegar?.(vista);
  };

  return (
    <footer className="landing-footer">
      <div className="landing-footer-col">
        <div className="landing-navbar-logo">
        <img src={LogoAuraPetSinFondo} alt="AuraPet" className="landing-logo-icono" /> 
          <span>AuraPet</span>
        </div>
      </div>

      <div className="landing-footer-col">
        <h4>Rápida links</h4>
        <a href="#duenos" onClick={irA("duenos")}>Soporte técnico</a>
        <a href="#duenos" onClick={irA("duenos")}>Para dueños</a>
        <a href="#veterinarias" onClick={irA("veterinarias")}>Para veterinarias</a>
      </div>

      <div className="landing-footer-col">
        <h4>Para veterinarias</h4>
        <a href="#nosotros" onClick={irA("nosotros")}>Nosotros</a>
        <a href="#veterinarias" onClick={irA("veterinarias")}>Para veterinarias</a>
        <a
          href="#contacto"
          className={vistaActiva === "contacto" ? "landing-navbar-link-activo" : ""}
          onClick={irA("contacto")}
        >
          Contacto
        </a>
        <a href="#">Otro</a>
      </div>

      <div className="landing-footer-col">
        <h4>Social</h4>
        <div className="contacto-footer-social">
          <span>f</span>
          <span>o</span>
          <span>t</span>
          <span>yt</span>
        </div>
      </div>

      <div className="landing-footer-bottom">
        © Copyright 2026. Derechos Reservados.
      </div>
    </footer>
  );
};