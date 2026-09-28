import '../css/NavBar.css';

export type VistaLanding = "landing" | "como-funciona" | "veterinarias" | "duenos" | "nosotros";

interface LandingNavbarProps {
  vistaActiva?: VistaLanding;
  onNavegar?: (vista: VistaLanding) => void;
  onIngresar?: () => void;
}

const links: { vista: VistaLanding; label: string }[] = [
  { vista: "como-funciona", label: "Cómo funciona" },
  { vista: "veterinarias", label: "Para veterinarias" },
  { vista: "duenos", label: "Para dueños" },
  { vista: "nosotros", label: "Nosotros" },
];

export const NavBar = ({ vistaActiva, onNavegar, onIngresar }: LandingNavbarProps) => {
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
    </nav>
  );
};
