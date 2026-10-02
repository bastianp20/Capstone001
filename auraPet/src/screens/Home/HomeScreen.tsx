import { useState } from "react";
import {
  Calendar,
  UserPlus,
  Search,
  Quote,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Colors} from "../../constants";
// import { LoginScreen } from "../Login/LoginScreen";
import { NavBar } from "../../components/NavBar";
import type { VistaHome } from "../../interfaces";
import "../../css/HomePage.css";
import {Nosotros} from '../Home/NosotrosScreen'; 
import { ParaDuenos } from "./ParaDuenosScreen";
import {ParaVeterinarias} from '../Home/ParaVeterinariasScreen'; 
import { ComoFunciona } from "./ComoFuncionaScreen";
import { ContactoScreen } from "./ContactoScreen";
import { Footer } from "../../components/Footer";
import { Servicios } from "../../components/Servicios";
import { getPreguntasFrecuentes } from "../../Api/getInfo";
import fondo from '../../assets/Home/fondo.png';
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


export const HomeScreen = () => { 
  const [mostrarLogin, setMostrarLogin] = useState(false);
//   const [mostrarConocer, setMostrarConocer] = useState(false); 
  const [testimonioActual, setTestimonioActual] = useState(0);
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);
  const [formulario, setFormulario] = useState({ nombre: "", correo: "", mensaje: "" });

  const [vista, setVista] = useState<VistaHome>("landing");

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

    if (vista === "nosotros") {
    return <Nosotros onNavegar={setVista} onIngresar={() => setMostrarLogin(true)} />;
  }

  if (vista === "duenos") {
    return <ParaDuenos onNavegar={setVista} onIngresar={() => setMostrarLogin(true)} />;
  }

  if (vista === "veterinarias") {
    return <ParaVeterinarias onNavegar={setVista} onIngresar={() => setMostrarLogin(true)} />;
  }

  if (vista === "como-funciona") {
    return <ComoFunciona onNavegar={setVista} onIngresar={() => setMostrarLogin(true)} />;
  }

  if (vista === "contacto") {
    return <ContactoScreen onNavegar={setVista} onIngresar={ () => setMostrarLogin(true)}/>
  }

  return (
    <div className="landing-page" style={temaVars}>
      {/* Navbar */}
      <NavBar vistaActiva="landing" onNavegar={setVista} onIngresar={() => setMostrarLogin(true)} />

      {/* Hero */}
      <header className="landing-hero" style={{ backgroundImage: `url(${fondo})` }}>
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
      <Servicios />

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

      {/* Preguntas Frecuentes + contacto */}
      <section className="landing-seccion landing-faq-contacto" id="contacto">
        <div className="landing-faq">
          <h2>¿Tienes dudas?</h2>
          {getPreguntasFrecuentes().map((item, i) => (
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
        <Footer/>
    </div>
  );
};
