import { useState } from "react";
import {
  Mail,
  MessageCircle,
  MapPin,
  User,
  PawPrint,
  Megaphone,
  ChevronDown,
} from "lucide-react";
import { Colors } from "../../constants";
import { NavBar } from "../../components/NavBar";
import type { ContactoScreenProps, 
} from "../../interfaces";
import "../../css/Contacto.css";
import { Footer } from "../../components/Footer";
import { getPreguntasFrecuentes } from "../../Api/getInfo";

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

const otrasFormas = [
  {
    titulo: "Soporte para dueños",
    descripcion: "¿Tienes dudas sobre tu mascota o tu cuenta?",
    icono: User,
    link: "soporte@aurapet.com",
  },
  {
    titulo: "Soporte para veterinarias",
    descripcion: "Ayuda para centros y profesionales afiliados",
    icono: PawPrint,
    link: "veterinarias@aurapet.com",
  },
  {
    titulo: "Prensa y alianzas",
    descripcion: "Para medios y posibles socios",
    icono: Megaphone,
    link: "prensa@aurapet.com",
  },
];

export const ContactoScreen = ({ onNavegar, onIngresar }: ContactoScreenProps) => {
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    asunto: "Soporte técnico",
    mensaje: "",
  });
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);
  const preguntasFrecuentes = getPreguntasFrecuentes();

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: conectar con backend real cuando exista. Por ahora solo mock.
    console.log("formulario de contacto:", formulario);
    setFormulario({ nombre: "", correo: "", asunto: "Soporte técnico", mensaje: "" });
  };

  return (
    <div className="contacto-page" style={temaVars}>
      <NavBar vistaActiva="contacto" onNavegar={onNavegar} onIngresar={onIngresar} />

      {/* Hero */}
      <header className="contacto-hero">
        <h1>¿Tienes dudas? Hablemos</h1>
        <p>Estamos para ayudarte a resolver cualquier consulta sobre AuraPet</p>
      </header>

      {/* Formulario + datos de contacto */}
      <section className="contacto-principal">
        <form className="contacto-form" onSubmit={handleEnviar}>
          <label className="contacto-label" htmlFor="contacto-nombre">Nombre</label>
          <input
            id="contacto-nombre"
            type="text"
            placeholder="Nombre"
            value={formulario.nombre}
            onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
          />

          <label className="contacto-label" htmlFor="contacto-correo">Correo electrónico</label>
          <input
            id="contacto-correo"
            type="email"
            placeholder="Correo electrónico"
            value={formulario.correo}
            onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })}
          />

          <label className="contacto-label" htmlFor="contacto-asunto">Asunto</label>
          <select
            id="contacto-asunto"
            value={formulario.asunto}
            onChange={(e) => setFormulario({ ...formulario, asunto: e.target.value })}
          >
            <option>Soporte técnico</option>
            <option>Para dueños</option>
            <option>Para veterinarias</option>
            <option>Otro</option>
          </select>

          <label className="contacto-label" htmlFor="contacto-mensaje">Mensaje</label>
          <textarea
            id="contacto-mensaje"
            placeholder="Mensaje"
            value={formulario.mensaje}
            onChange={(e) => setFormulario({ ...formulario, mensaje: e.target.value })}
          />

          <button type="submit" className="landing-btn-primario">Enviar mensaje</button>
        </form>

        <div className="contacto-info">
          <div className="contacto-info-card">
            <div className="contacto-info-item">
              <span className="contacto-info-icono"><Mail size={16} color="#ffffff" /></span>
              <div>
                <p className="contacto-info-titulo">Email</p>
                <p className="contacto-info-valor">SupportAuraPet@gmail.com</p>
              </div>
            </div>
            <div className="contacto-info-item">
              <span className="contacto-info-icono"><MessageCircle size={16} color="#ffffff" /></span>
              <div>
                <p className="contacto-info-titulo">Teléfono/WhatsApp</p>
                <p className="contacto-info-valor">+56 9 1234 5678</p>
              </div>
            </div>
            <div className="contacto-info-item">
              <span className="contacto-info-icono"><MapPin size={16} color="#ffffff" /></span>
              <div>
                <p className="contacto-info-titulo">Atención</p>
                <p className="contacto-info-valor">Atención 100% online</p>
              </div>
            </div>
          </div>

          <div className="contacto-horarios">
            <p className="contacto-horarios-titulo">Horarios de atención</p>
            <p>Lunes – 8:00 a.m.</p>
            <p>Martes – 10:00 a.m.</p>
            <p>Miércoles – 2:00 p.m.</p>
          </div>
        </div>
      </section>

      {/* Otras formas de contacto */}
      <section className="contacto-otras">
        <h2>otras formas de contacto</h2>
        <div className="contacto-otras-grid">
          {otrasFormas.map((item) => {
            const Icono = item.icono;
            return (
              <div className="contacto-otras-card" key={item.titulo}>
                <div className="contacto-otras-icono">
                  <Icono size={20} color={colors.primario} />
                </div>
                <h3>{item.titulo}</h3>
                <p>{item.descripcion}</p>
                <a href="#">{item.link}</a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="contacto-faq">
        {preguntasFrecuentes.map((item, i) => (
          <div className="contacto-faq-item" key={item.pregunta}>
            <button
              className="contacto-faq-pregunta"
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
            {faqAbierta === i && <p className="contacto-faq-respuesta">{item.respuesta}</p>}
          </div>
        ))}
      </section>

        <Footer/>
    </div>
  );
};