import { useState } from "react";
import {
  Calendar,
  FileText,
  MapPin,
  UserPlus,
  Search,
  Quote,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Colors } from "../../constants";
import { LoginScreen } from "../Login/LoginScreen";
import "../../css/HomePage.css";
import { ConocenosModal } from "../../Modal/ConocenosModal";

const colors = Colors;

// variables de tema que le pasamos al contenedor raíz, mismo patrón que
// usamos en duenos.tsx / VeterinarioScreen.tsx para bajar los colores de
// constants.ts a CSS custom properties de esta pantalla
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

// TODO: esto es contenido mock, más adelante puede venir de Api/getInfo.tsx
// o directo de un CMS si se arma uno.
const servicios = [
  {
    icono: Calendar,
    titulo: "Agendar citas",
    descripcion: "Reserva hora con la veterinaria que prefieras en pocos clics.",
  },
  {
    icono: FileText,
    titulo: "Historial médico digital",
    descripcion: "Toda la ficha clínica de tu mascota disponible cuando la necesites.",
  },
  {
    icono: MapPin,
    titulo: "Encontrar veterinarios cercanos",
    descripcion: "Busca centros y especialistas cerca de ti, con reseñas reales.",
  },
];

const testimonios = [
  { texto: "Agendar hora para mi perro nunca había sido tan fácil.", nombre: "Camila Rojas", rol: "Dueña de mascota" },
  { texto: "Tener el historial digital me ahorra tiempo en cada consulta.", nombre: "Ana Duarte", rol: "Veterinaria" },
  { texto: "Encontré una veterinaria cerca en minutos.", nombre: "Joaquín Bahes", rol: "Dueño de mascota" },
  { texto: "La app me ayuda a organizar mi agenda de pacientes.", nombre: "Frank de Álamos", rol: "Veterinario" },
];

const pasos = [
  { numero: 1, titulo: "Regístrate", descripcion: "Crea tu cuenta como dueño o veterinaria en minutos." },
  { numero: 2, titulo: "Encuentra tu veterinaria", descripcion: "Busca por cercanía, especialidad o disponibilidad." },
  { numero: 3, titulo: "Agenda tu cita", descripcion: "Elige el horario que más te acomode y listo." },
];

const preguntasFrecuentes = [
  { pregunta: "¿Cómo registro a mi mascota?", respuesta: "Desde tu cuenta de dueño puedes agregar una mascota nueva con sus datos básicos y ficha médica." },
  { pregunta: "¿Cómo encuentro veterinarias cercanas?", respuesta: "Usa el buscador por ubicación en la sección 'Para dueños' para ver centros y veterinarios disponibles." },
  { pregunta: "¿Puedo cambiar una cita ya agendada?", respuesta: "Sí, puedes reprogramar o cancelar desde tu panel de citas con anticipación." },
  { pregunta: "¿Cómo accedo al historial médico?", respuesta: "El historial está disponible en tu perfil de dueño, actualizado por cada veterinaria que atendió a tu mascota." },
  { pregunta: "¿Cómo elimino mi cuenta de AuraPet?", respuesta: "Puedes solicitarlo desde Configuración o escribiéndonos por el formulario de contacto." },
];

export const HomeScreen = () => {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarConocerModal, setMostrarConocerModal] = useState(false); 
  const [testimonioActual, setTestimonioActual] = useState(0);
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);
  const [formulario, setFormulario] = useState({ nombre: "", correo: "", mensaje: "" });

  const testimoniosVisibles = 3;
  const maxIndice = Math.max(0, testimonios.length - testimoniosVisibles);

  const anteriorTestimonio = () => setTestimonioActual((i) => Math.max(0, i - 1));
  const siguienteTestimonio = () => setTestimonioActual((i) => Math.min(maxIndice, i + 1));

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: conectar con backend real cuando exista. Por ahora solo mock.
    console.log("formulario de contacto:", formulario);
    setFormulario({ nombre: "", correo: "", mensaje: "" });
  };

  return (
    <div className="landing-page" style={temaVars}>
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-navbar-logo">
          <span className="landing-logo-icono">🐾</span>
          <span>AuraPet</span>
        </div>
        <div className="landing-navbar-links">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#veterinarias">Para veterinarias</a>
          <a href="#duenos">Para dueños</a>
          <a href="#nosotros" onClick={() => setMostrarConocerModal(true)}>Nosotros</a>
          <a href="#contacto">Contacto</a>
        </div>
        <button className="landing-btn-primario" onClick={() => setMostrarLogin(true)}>
          Ingresar
        </button>
        <Menu className="landing-navbar-menu-icono" size={22} />
      </nav>

      {/* Hero */}
      <header className="landing-hero">
        <div className="landing-hero-overlay" />
        <div className="landing-hero-contenido">
          <h1>
            Cuidamos la salud
            <br />
            de tu mascota, en
            <br />
            un solo lugar
          </h1>
          <p>
            Conecta con veterinarias de confianza, agenda citas y lleva el
            historial médico de tu mascota en un solo lugar.
          </p>
          {/* TODO: por ahora manda al login igual que "Ingresar"; más
              adelante podría abrir directo un flujo de registro/agendar. */}
          <button className="landing-btn-primario landing-btn-hero" onClick={() => setMostrarLogin(true)}>
            Agenda una cita
          </button>
        </div>
      </header>

      {/* Servicios */}
      <section className="landing-seccion">
        <h2>¿Qué puedes hacer en AuraPet?</h2>
        <div className="landing-servicios-grid">
          {servicios.map((servicio) => {
            const Icono = servicio.icono;
            return (
              <div className="landing-servicio-card" key={servicio.titulo}>
                <div className="landing-servicio-icono">
                  <Icono size={22} color={colors.primario} />
                </div>
                <h3>{servicio.titulo}</h3>
                <p>{servicio.descripcion}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bloque oscuro con "imagen" (mockup de historial) + texto */}
      <section className="landing-seccion-oscura">
        <div className="landing-mockup-historial">
          <div className="landing-mockup-header" />
          {[1, 2, 3, 4].map((n) => (
            <div className="landing-mockup-linea" key={n} />
          ))}
        </div>
        <div className="landing-seccion-oscura-texto">
          <h2>Todo el historial de tu mascota en un solo lugar</h2>
          <p>
            Consulta diagnósticos, tratamientos y recetas anteriores desde
            cualquier dispositivo, sin cargar papeles ni recordar fechas.
          </p>
          <button className="landing-btn-primario" onClick={() => setMostrarLogin(true)}>
            Agenda una cita
          </button>
        </div>
      </section>

      {/* Testimonios */}
      <section className="landing-seccion landing-seccion-suave">
        <h2>Lo que dicen nuestros usuarios</h2>
        <div className="landing-testimonios-wrapper">
          <button
            className="landing-carrusel-flecha"
            onClick={anteriorTestimonio}
            disabled={testimonioActual === 0}
            aria-label="Testimonio anterior"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="landing-testimonios-grid">
            {testimonios
              .slice(testimonioActual, testimonioActual + testimoniosVisibles)
              .map((t) => (
                <div className="landing-testimonio-card" key={t.nombre}>
                  <Quote size={18} color={colors.primario} />
                  <p>"{t.texto}"</p>
                  <span className="landing-testimonio-nombre">{t.nombre}</span>
                  <span className="landing-testimonio-rol">{t.rol}</span>
                </div>
              ))}
          </div>

          <button
            className="landing-carrusel-flecha"
            onClick={siguienteTestimonio}
            disabled={testimonioActual === maxIndice}
            aria-label="Siguiente testimonio"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="landing-seccion landing-seccion-suave" id="como-funciona">
        <h2>¿Cómo funciona?</h2>
        <div className="landing-pasos-grid">
          {pasos.map((paso) => (
            <div className="landing-paso" key={paso.numero}>
              <div className="landing-paso-icono">
                {paso.numero === 1 && <UserPlus size={20} color={colors.primario} />}
                {paso.numero === 2 && <Search size={20} color={colors.primario} />}
                {paso.numero === 3 && <Calendar size={20} color={colors.primario} />}
              </div>
              <h4>{paso.numero}. {paso.titulo}</h4>
              <p>{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA oscuro */}
      <section className="landing-cta-final">
        <div className="landing-cta-final-texto">
          <h2>Da el siguiente paso en el cuidado de tu mascota</h2>
          <ul>
            <li>Historial médico siempre disponible</li>
            <li>Veterinarias verificadas y con reseñas</li>
            <li>Agenda tus citas en segundos</li>
          </ul>
          <button className="landing-btn-primario" onClick={() => setMostrarLogin(true)}>
            Agenda una cita
          </button>
        </div>
        <div className="landing-cta-final-imagen" />
      </section>

      {/* FAQ + contacto */}
      <section className="landing-seccion landing-faq-contacto" id="contacto">
        <div className="landing-faq">
          <h2>¿Tienes dudas?</h2>
          {preguntasFrecuentes.map((item, i) => (
            <div className="landing-faq-item" key={item.pregunta}>
              <button
                className="landing-faq-pregunta"
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
              {faqAbierta === i && <p className="landing-faq-respuesta">{item.respuesta}</p>}
            </div>
          ))}
        </div>

        <form className="landing-contacto-form" onSubmit={handleEnviar}>
          <h3>¿Te podemos ayudar?</h3>
          <p>Si necesitas asesoría, ¡contáctanos!</p>
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            value={formulario.nombre}
            onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
          />
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={formulario.correo}
            onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })}
          />
          <textarea
            placeholder="Mensaje"
            value={formulario.mensaje}
            onChange={(e) => setFormulario({ ...formulario, mensaje: e.target.value })}
          />
          <button type="submit" className="landing-btn-primario">Enviar</button>
        </form>
      </section>

      {/* Footer */}
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
          <a href="#veterinarias">Para veterinarias</a>
          <a href="#duenos">Para dueños</a>
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

      {mostrarLogin && <LoginScreen onCerrar={() => setMostrarLogin(false)} />}
      {mostrarConocerModal && <ConocenosModal onCerrar= {() => setMostrarConocerModal(false)}/> }
    </div>
  );
};
