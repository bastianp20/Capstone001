import {
  ShieldCheck,
  HeartHandshake,
  Lightbulb,
  HeartPulse,
  User,
} from "lucide-react";
import { Colors } from "../../constants";
import { NavBar } from "../../components/NavBar";
import type { VistaHome } from "../../interfaces";
import "../../css/HomePage.css";

const colors = Colors;

const temaVars = {
  "--landing-primario": colors.primario,
  "--landing-secundario": colors.secundario,
  "--landing-oscuro": colors.oscuro,
  "--landing-sidebar-oscuro": colors.sidebarOscuro,
  "--landing-texto": colors.texto,
  "--landing-texto-suave": colors.textoSuave,
  "--landing-texto-sidebar": colors.textoSidebar,
  "--landing-borde": colors.borde,
} as React.CSSProperties;

// TODO: contenido mock, ajustar cuando tengamos la info real de la empresa.
const valores = [
  { icono: ShieldCheck, titulo: "Confianza", descripcion: "Veterinarias verificadas y reseñas reales." },
  { icono: HeartHandshake, titulo: "Cercanía", descripcion: "Acompañamos a cada dueño en el cuidado de su mascota." },
  { icono: Lightbulb, titulo: "Innovación", descripcion: "Tecnología simple para resolver problemas reales." },
  { icono: HeartPulse, titulo: "Bienestar animal", descripcion: "Todo lo que hacemos apunta a mejorar su salud." },
];

const equipo = [
  { nombre: "Dra. Elena Ruiz", cargo: "Fundadora" },
  { nombre: "Carlos Gómez", cargo: "Head de Producto" },
  { nombre: "Javier Solís", cargo: "Ingeniero Senior" },
  { nombre: "Dra. Ana Torres", cargo: "Veterinaria asesora" },
];

const logros = [
  { numero: "+500", descripcion: "mascotas registradas" },
  { numero: "+50", descripcion: "veterinarias aliadas" },
  { numero: "+1000", descripcion: "citas agendadas" },
];

interface NosotrosScreenProps {
  onIngresar?: () => void;
  onNavegar?: (vista: VistaHome) => void;
}

export const Nosotros = ({ onIngresar, onNavegar }: NosotrosScreenProps) => {
  return (
    <div className="nosotros-page" style={temaVars}>
      <NavBar vistaActiva="nosotros" onNavegar={onNavegar} onIngresar={onIngresar} />

      {/* Hero */}
      <section className="nosotros-hero">
        <div className="nosotros-hero-texto">
          <span className="nosotros-hero-etiqueta">Nosotros</span>
          <h1>Nuestra misión es cuidar mejor a tus mascotas</h1>
          <p>
            En AuraPet utilizamos la tecnología para conectar a los dueños
            con las mejores veterinarias y especialistas, garantizando el
            bienestar animal.
          </p>
        </div>
        <div className="nosotros-hero-imagen" />
      </section>

      {/* Misión y visión */}
      <section className="nosotros-seccion">
        <h2>Misión y Visión</h2>
        <div className="nosotros-mision-vision-grid">
          <div className="nosotros-mv-card">
            <h3>Nuestra misión</h3>
            <p>
              Facilitar el acceso a cuidado veterinario de calidad,
              conectando a los dueños con las mejores veterinarias y
              especialistas cerca de ellos.
            </p>
          </div>
          <div className="nosotros-mv-card">
            <h3>Nuestra visión</h3>
            <p>
              Ser la plataforma de referencia en Latinoamérica para el
              cuidado animal, garantizando bienestar y confianza en cada
              consulta.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="nosotros-seccion">
        <h2>Valores</h2>
        <div className="nosotros-valores-grid">
          {valores.map((valor) => {
            const Icono = valor.icono;
            return (
              <div className="nosotros-valor-card" key={valor.titulo}>
                <div className="nosotros-valor-icono">
                  <Icono size={20} color={colors.primario} />
                </div>
                <h4>{valor.titulo}</h4>
                <p>{valor.descripcion}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Equipo */}
      <section className="nosotros-seccion">
        <h2>Nuestro equipo</h2>
        <div className="nosotros-equipo-grid">
          {equipo.map((persona) => (
            <div className="nosotros-persona" key={persona.nombre}>
              <div className="nosotros-persona-avatar">
                <User size={26} color={colors.primario} />
              </div>
              <span className="nosotros-persona-nombre">{persona.nombre}</span>
              <span className="nosotros-persona-cargo">{persona.cargo}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Logros (fondo oscuro) */}
      <section className="nosotros-logros">
        <h2>Logros</h2>
        <div className="nosotros-logros-grid">
          {logros.map((logro) => (
            <div className="nosotros-logro" key={logro.descripcion}>
              <span className="nosotros-logro-numero">{logro.numero}</span>
              <span className="nosotros-logro-descripcion">{logro.descripcion}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer (mismo patrón que LandingScreen) */}
      <footer className="landing-footer">
        <div className="landing-footer-col">
          <div className="landing-navbar-logo">
            <span className="landing-logo-icono">🐾</span>
            <span>AuraPet</span>
          </div>
          <p>Conectando dueños y veterinarias en un solo lugar.</p>
        </div>
        <div className="landing-footer-col">
          <h4>Explora</h4>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#duenos">Para dueños</a>
          <a href="#nosotros">Nosotros</a>
        </div>
        <div className="landing-footer-col">
          <h4>Contacto</h4>
          <a href="mailto:contacto@aurapet.com">Correo</a>
          <a href="#">WhatsApp</a>
        </div>
        <div className="landing-footer-col">
          <h4>Newsletter</h4>
          <p>Únete y accede a contenido exclusivo.</p>
        </div>
        <div className="landing-footer-bottom">
          © {new Date().getFullYear()} AuraPet. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};