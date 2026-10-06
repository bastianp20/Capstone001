import {
  Calendar,
  FileText,
  Users,
  FilePenLine,
  UserPlus,
  Building2,
  CalendarCheck,
} from "lucide-react";
import { Colors } from "../../constants";
import "../../css/ParaVeterinarias.css";
import PrimeraFoto from '../../assets/ParaVeterinarias/PrimeraFoto.png'; 
import PanelProfesional from '../../assets/ParaVeterinarias/PanelProfesional.png'; 

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
const beneficios = [
  { icono: Calendar, titulo: "Agenda digital de pacientes" },
  { icono: FileText, titulo: "Historial clínico centralizado" },
  { icono: Users, titulo: "Más visibilidad ante nuevos dueños" },
  { icono: FilePenLine, titulo: "Gestiona recetas y diagnósticos fácilmente" },
];

const testimonios = [
  { texto: "Encontrar a la mejor veterinaria fue facilísimo gracias a AuraPet. ¡Totalmente recomendado!", nombre: "Dr. Carlos Ruiz", especialidad: "Cirugía General" },
  { texto: "Encontrar a la mejor veterinaria fue facilísimo gracias a AuraPet. ¡Totalmente recomendado!", nombre: "Dr. Carlos Ruiz", especialidad: "Cirugía General" },
  { texto: "Encontrar a la mejor veterinaria fue facilísimo gracias a AuraPet. ¡Totalmente recomendado!", nombre: "Dr. Carlos Ruiz", especialidad: "Cirugía General" },
];

const pasos = [
  { numero: 1, icono: UserPlus, titulo: "Crea tu perfil profesional" },
  { numero: 2, icono: Building2, titulo: "Verifica tu clínica" },
  { numero: 3, icono: CalendarCheck, titulo: "Empieza a recibir pacientes" },
];

export const ParaVeterinarias = () => {
  return (
    <div className="paravets-page" style={temaVars}>
      {/* Hero */}
      <header className="paravets-hero">
        <div className="paravets-hero-texto">
          <h1>Haz crecer tu clínica con AuraPet</h1>
          <p>Más pacientes, menos papeleo.</p>
          <button className="landing-btn-primario">Únete como veterinaria</button>
        </div>
        <img src={PrimeraFoto} alt="Mockup de siguiente paso" className="paravets-hero-imagen" />
      </header>

      {/* Beneficios */}
      <section className="paravets-seccion">
        <span className="paravets-etiqueta">Beneficios clave</span>
        <h2>¿Por qué sumarte a AuraPet?</h2>
        <div className="paravets-beneficios-grid">
          {beneficios.map((b) => {
            const Icono = b.icono;
            return (
              <div className="paravets-beneficio-card" key={b.titulo}>
                <div className="paravets-beneficio-icono">
                  <Icono size={20} color={colors.primario} />
                </div>
                <p>{b.titulo}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bloque oscuro con mockup de panel */}
      <section className="paravets-seccion-oscura">
        <div className="paravets-mockup-panel">
          <div className="paravets-mockup-monitor">
            <div className="paravets-mockup-pantalla">
              <img
                src={PanelProfesional}
                alt="Panel profesional de AuraPet con pacientes, registros y gráfica de visitas"
                className="paravets-mockup-imagen"
              />
            </div>
            <div className="paravets-mockup-base" />
          </div>  
        </div>
        <div className="paravets-seccion-oscura-texto">
          <h2>Panel profesional completo y fácil de usar.</h2>
          <p>Panel profesional completo y fácil de usar. Gestión integral de tu clínica.</p>
        </div>
      </section>

      {/* Testimonios */}
      <section className="paravets-seccion paravets-seccion-suave">
        <h2>Testimonios</h2>
        <div className="paravets-testimonios-grid">
          {testimonios.map((t, i) => (
            <div className="paravets-testimonio-card" key={i}>
              <p>"{t.texto}"</p>
              <span className="paravets-testimonio-nombre">- {t.nombre}</span>
              <span className="paravets-testimonio-especialidad">{t.especialidad}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo me sumo */}
      <section className="paravets-seccion">
        <h2>¿Cómo me sumo?</h2>
        <div className="paravets-pasos-grid">
          {pasos.map((paso) => {
            const Icono = paso.icono;
            return (
              <div className="paravets-paso" key={paso.numero}>
                <div className="paravets-paso-numero">{paso.numero}</div>
                <div className="paravets-paso-icono">
                  <Icono size={20} color={colors.primario} />
                </div>
                <p>{paso.titulo}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA final */}
      <section className="paravets-cta-final">
        <div className="paravets-cta-final-imagen" />
        <div className="paravets-cta-final-texto">
          <h2>¿Listo para simplificar el cuidado de tu mascota?</h2>
          <button className="landing-btn-primario">Únete como veterinaria</button>
        </div>
      </section>
    </div>
  );
};