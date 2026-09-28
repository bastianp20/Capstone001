import { useState } from "react";
import {
  UserPlus,
  PawPrint,
  Search,
  Calendar,
  Building2,
  ClipboardCheck,
  Users,
  ChevronDown,
} from "lucide-react";
import { Colors } from "../../constants";
import "../../css/ComoFunciona.css";

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

// TODO: contenido mock, ajustar cuando tengamos copy real de marketing.
const pasosDuenos = [
  { numero: 1, icono: UserPlus, titulo: "Crea tu cuenta", descripcion: "Crea tu cuenta y regístrate como dueño de mascota." },
  { numero: 2, icono: PawPrint, titulo: "Agrega a tu mascota", descripcion: "Agrega a tu mascota y su información básica." },
  { numero: 3, icono: Search, titulo: "Busca una veterinaria", descripcion: "Busca una clínica o especialista cerca de ti." },
  { numero: 4, icono: Calendar, titulo: "Agenda tu cita", descripcion: "Agenda tu cita según la disponibilidad de la veterinaria." },
];

const pasosVeterinarias = [
  { numero: 1, icono: UserPlus, titulo: "Crea tu perfil profesional", descripcion: "Regístrate como veterinaria o veterinario independiente." },
  { numero: 2, icono: Building2, titulo: "Verifica tu clínica", descripcion: "Valida tus datos y los de tu centro veterinario." },
  { numero: 3, icono: Users, titulo: "Recibe solicitudes", descripcion: "Nuevos dueños te encuentran y agendan contigo." },
  { numero: 4, icono: ClipboardCheck, titulo: "Gestiona tus pacientes", descripcion: "Lleva la agenda, el historial y las recetas desde un solo lugar." },
];

const preguntasFrecuentes = [
  { pregunta: "¿Cuánto tiempo toma agendar una cita?", respuesta: "Solo un par de minutos: eliges la veterinaria, el horario disponible y confirmas." },
  { pregunta: "¿Puedo cambiar de veterinaria después?", respuesta: "Sí, puedes agendar con otra veterinaria cuando quieras, sin perder el historial de tu mascota." },
  { pregunta: "¿Cómo verifican a las veterinarias?", respuesta: "Cada clínica o profesional pasa por una validación de datos antes de aparecer en la búsqueda." },
];

interface ComoFuncionaScreenProps {
  onVolver?: () => void;
  onIngresar?: () => void;
}

export const ComoFunciona = ({ onVolver, onIngresar }: ComoFuncionaScreenProps) => {
  const [pestanaActiva, setPestanaActiva] = useState<"duenos" | "veterinarias">("duenos");
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);

  const pasos = pestanaActiva === "duenos" ? pasosDuenos : pasosVeterinarias;

  return (
    <div className="comofunciona-page" style={temaVars}>
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-navbar-logo" onClick={onVolver} style={{ cursor: "pointer" }}>
          <span className="landing-logo-icono">🐾</span>
          <span>AuraPet</span>
        </div>
        <div className="landing-navbar-links">
          <a href="#como-funciona" className="landing-navbar-link-activo">Cómo funciona</a>
          <a href="#veterinarias">Para veterinarias</a>
          <a href="#duenos">Para dueños</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </div>
        <button className="landing-btn-primario" onClick={onIngresar}>
          Ingresar
        </button>
      </nav>

      {/* Hero */}
      <header className="comofunciona-hero">
        <h1>Así de simple funciona AuraPet</h1>
        <p>El proceso completo, ya seas un dueño de mascota o una clínica veterinaria.</p>

        <div className="comofunciona-tabs">
          <button
            className={`comofunciona-tab ${pestanaActiva === "duenos" ? "activa" : ""}`}
            onClick={() => setPestanaActiva("duenos")}
          >
            Para dueños
          </button>
          <button
            className={`comofunciona-tab ${pestanaActiva === "veterinarias" ? "activa" : ""}`}
            onClick={() => setPestanaActiva("veterinarias")}
          >
            Para veterinarias
          </button>
        </div>
      </header>

      {/* Pasos alternados */}
      <section className="comofunciona-pasos">
        {pasos.map((paso, i) => {
          const Icono = paso.icono;
          const imagenPrimero = i % 2 !== 0;
          return (
            <div className={`comofunciona-paso-fila ${imagenPrimero ? "invertida" : ""}`} key={paso.numero}>
              <div className="comofunciona-paso-texto">
                <div className="comofunciona-paso-numero">{paso.numero}</div>
                <Icono size={20} color={colors.primario} style={{ marginBottom: 8 }} />
                <h3>{paso.titulo}</h3>
                <p>{paso.descripcion}</p>
              </div>
              <div className="comofunciona-paso-mockup" />
            </div>
          );
        })}
      </section>

      {/* Timeline oscuro */}
      <section className="comofunciona-timeline">
        <div className="comofunciona-timeline-linea">
          {pasos.map((paso) => (
            <div className="comofunciona-timeline-punto" key={paso.numero}>
              <span className="comofunciona-timeline-dot" />
              <span className="comofunciona-timeline-label">{paso.titulo}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="comofunciona-faq">
        {preguntasFrecuentes.map((item, i) => (
          <div className="comofunciona-faq-item" key={item.pregunta}>
            <button
              className="comofunciona-faq-pregunta"
              onClick={() => setFaqAbierta(faqAbierta === i ? null : i)}
            >
              {item.pregunta}
              <ChevronDown
                size={16}
                style={{
                  transform: faqAbierta === i ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
            {faqAbierta === i && <p className="comofunciona-faq-respuesta">{item.respuesta}</p>}
          </div>
        ))}
      </section>

      {/* CTA final */}
      <section className="comofunciona-cta">
        <h2>CTA</h2>
        <button className="landing-btn-primario">Comienza ahora</button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-col">
          <div className="landing-navbar-logo">
            <span className="landing-logo-icono">🐾</span>
            <span>AuraPet</span>
          </div>
          <p>Portal que conecta a un dueño de mascota o una clínica veterinaria.</p>
        </div>
        <div className="landing-footer-col">
          <h4>Links</h4>
          <a href="#como-funciona" className="landing-navbar-link-activo">Cómo funciona</a>
          <a href="#veterinarias">Para veterinarias</a>
          <a href="#duenos">Para dueños</a>
        </div>
        <div className="landing-footer-col">
          <h4>Para veterinarias</h4>
          <a href="#veterinarias">Para veterinarias</a>
          <a href="#duenos">Para dueños</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div className="landing-footer-col">
          <h4>Social</h4>
          <div className="comofunciona-footer-social">
            <span>f</span>
            <span>t</span>
            <span>o</span>
            <span>in</span>
          </div>
        </div>
        <div className="landing-footer-bottom">
          Copyright © {new Date().getFullYear()} AuraPet Inc.
        </div>
      </footer>
    </div>
  );
};