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

// Para los dueños
import CrearCuenta from "../../assets/ComoFunciona/ParaDuenos/CrearCuenta.png";
import AgregarTuMascota from "../../assets/ComoFunciona/ParaDuenos/AgregaTuMascota.png";
import BuscaTuVeterinaria from "../../assets/ComoFunciona/ParaDuenos/BuscaTuVeterinaria.png";
import AgendaCita from "../../assets/ComoFunciona/ParaDuenos/AgendaCita.png";

// Para los Veterinarios
import PerfilVet from "../../assets/ComoFunciona/ParaVeterinarias/PerfilVet.png";
import VerificaTuVet from "../../assets/ComoFunciona/ParaVeterinarias/VerificaTuVet.png";
import RecibeSolicitudes from "../../assets/ComoFunciona/ParaVeterinarias/RecibeSolicitudes.png";
import GestionPacientes from "../../assets/ComoFunciona/ParaVeterinarias/GestionPacientes.png";

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
  { numero: 1, icono: UserPlus, titulo: "Crea tu cuenta", descripcion: "Crea tu cuenta y regístrate como dueño de mascota.", imagen: CrearCuenta, alt: "Formulario de registro de AuraPet" },
  { numero: 2, icono: PawPrint, titulo: "Agrega a tu mascota", descripcion: "Agrega a tu mascota y su información básica.", imagen: AgregarTuMascota, alt: "Ficha de una mascota registrada" },
  { numero: 3, icono: Search, titulo: "Busca una veterinaria", descripcion: "Busca una clínica o especialista cerca de ti.", imagen: BuscaTuVeterinaria, alt: "Buscador de veterinarias cercanas" },
  { numero: 4, icono: Calendar, titulo: "Agenda tu cita", descripcion: "Agenda tu cita según la disponibilidad de la veterinaria.", imagen: AgendaCita, alt: "Calendario con horas disponibles" },
];

const pasosVeterinarias = [
  { numero: 1, icono: UserPlus, titulo: "Crea tu perfil profesional", descripcion: "Regístrate como veterinaria o veterinario independiente.", imagen: PerfilVet, alt: "Perfil profesional de una veterinaria" },
  { numero: 2, icono: Building2, titulo: "Verifica tu clínica", descripcion: "Valida tus datos y los de tu centro veterinario.", imagen: VerificaTuVet, alt: "Validación de datos de la clínica" },
  { numero: 3, icono: Users, titulo: "Recibe solicitudes", descripcion: "Nuevos dueños te encuentran y agendan contigo.", imagen: RecibeSolicitudes, alt: "Lista de solicitudes de citas" },
  { numero: 4, icono: ClipboardCheck, titulo: "Gestiona tus pacientes", descripcion: "Lleva la agenda, el historial y las recetas desde un solo lugar.", imagen: GestionPacientes, alt: "Panel de agenda y pacientes" },
];

const preguntasFrecuentes = [
  { pregunta: "¿Cuánto tiempo toma agendar una cita?", respuesta: "Solo un par de minutos: eliges la veterinaria, el horario disponible y confirmas." },
  { pregunta: "¿Puedo cambiar de veterinaria después?", respuesta: "Sí, puedes agendar con otra veterinaria cuando quieras, sin perder el historial de tu mascota." },
  { pregunta: "¿Cómo verifican a las veterinarias?", respuesta: "Cada clínica o profesional pasa por una validación de datos antes de aparecer en la búsqueda." },
];


export const ComoFunciona = () => {
  const [pestanaActiva, setPestanaActiva] = useState<"duenos" | "veterinarias">("duenos");
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);

  const pasos = pestanaActiva === "duenos" ? pasosDuenos : pasosVeterinarias;

  return (
    <div className="comofunciona-page" style={temaVars}>

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
              <div className="comofunciona-paso-mockup">
                <img src={paso.imagen} alt={paso.alt} loading="lazy" />
              </div>
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

        {/* el cta es el llamado a la acción */}
      {/* CTA final */}
      <section className="comofunciona-cta">
        <h2> Registrate y lleva tu responsabilidad al siguiente nivel!</h2>
        <button className="landing-btn-primario">Comienza ahora</button>
      </section>

    </div>
  );
};