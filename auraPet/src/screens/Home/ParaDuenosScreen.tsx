
import {
  Calendar,
  FileText,
  MapPin,
  Syringe,
  UserPlus,
  PawPrint,
  CalendarCheck,
} from "lucide-react";
import { Colors } from "../../constants";
import "../../css/ParaDuenos.css";

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
  { icono: Calendar, titulo: "Agenda citas en segundos" },
  { icono: FileText, titulo: "Historial médico siempre a mano" },
  { icono: MapPin, titulo: "Encuentra veterinarias cercanas y verificadas" },
  { icono: Syringe, titulo: "Recordatorios de vacunas y controles" },
];

const testimonios = [
  { texto: "Encontrar a la mejor veterinaria fue facilísimo gracias a AuraPet. ¡Totalmente recomendado!", nombre: "María S.", mascota: "dueña de Toby (Perro)" },
  { texto: "Encontrar a la mejor veterinaria fue facilísimo gracias a AuraPet. ¡Totalmente recomendado!", nombre: "María S.", mascota: "dueña de Toby (Perro)" },
  { texto: "Encontrar a la mejor veterinaria fue facilísimo gracias a AuraPet. ¡Totalmente recomendado!", nombre: "María S.", mascota: "dueña de Toby (Perro)" },
];

const pasos = [
  { numero: 1, icono: UserPlus, titulo: "Crea tu cuenta" },
  { numero: 2, icono: PawPrint, titulo: "Agrega a tu mascota" },
  { numero: 3, icono: CalendarCheck, titulo: "Agenda tu primera cita" },
];


export const ParaDuenos = () => {
  return (
    <div className="paraduenos-page" style={temaVars}>

      {/* Hero */}
      <header className="paraduenos-hero">
        <div className="paraduenos-hero-texto">
          <h1>El cuidado de tu mascota, más simple que nunca</h1>
          <p>
            Agenda citas, lleva su historial médico y encuentra especialistas
            verificados desde un solo lugar.
          </p>
          <button className="landing-btn-primario">Regístrate gratis</button>
        </div>
        <div className="paraduenos-hero-imagen" />
      </header>

      {/* Beneficios */}
      <section className="paraduenos-seccion">
        <span className="paraduenos-etiqueta">Beneficios clave</span>
        <h2>¿Por qué usar AuraPet?</h2>
        <div className="paraduenos-beneficios-grid">
          {beneficios.map((b) => {
            const Icono = b.icono;
            return (
              <div className="paraduenos-beneficio-card" key={b.titulo}>
                <div className="paraduenos-beneficio-icono">
                  <Icono size={20} color={colors.primario} />
                </div>
                <p>{b.titulo}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bloque oscuro con mockup de celular */}
      <section className="paraduenos-seccion-oscura">
        <div className="paraduenos-mockup-celular">
          <div className="paraduenos-mockup-header">Mis mascotas</div>
          <div className="paraduenos-mockup-mascotas">
            <div className="paraduenos-mockup-mascota" />
            <div className="paraduenos-mockup-mascota" />
          </div>
          <div className="paraduenos-mockup-linea" />
          <div className="paraduenos-mockup-linea" style={{ width: "70%" }} />
        </div>
        <div className="paraduenos-seccion-oscura-texto">
          <h2>Todo bajo control desde tu móvil</h2>
          <p>
            Así de fácil es gestionar la salud de tu mascota: todo el
            cuidado, en un solo lugar y desde donde estés.
          </p>
        </div>
      </section>

      {/* Testimonios */}
      <section className="paraduenos-seccion paraduenos-seccion-suave">
        <h2>Testimonios</h2>
        <div className="paraduenos-testimonios-grid">
          {testimonios.map((t, i) => (
            <div className="paraduenos-testimonio-card" key={i}>
              <p>"{t.texto}"</p>
              <span className="paraduenos-testimonio-nombre">- {t.nombre}</span>
              <span className="paraduenos-testimonio-mascota">{t.mascota}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo empiezo */}
      <section className="paraduenos-seccion">
        <h2>¿Cómo empiezo?</h2>
        <div className="paraduenos-pasos-grid">
          {pasos.map((paso) => {
            const Icono = paso.icono;
            return (
              <div className="paraduenos-paso" key={paso.numero}>
                <div className="paraduenos-paso-numero">{paso.numero}</div>
                <div className="paraduenos-paso-icono">
                  <Icono size={20} color={colors.primario} />
                </div>
                <p>{paso.titulo}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA final */}
      <section className="paraduenos-cta-final">
        <div className="paraduenos-cta-final-texto">
          <h2>¿Listo para simplificar el cuidado de tu mascota?</h2>
          <button className="landing-btn-primario">Regístrate gratis</button>
        </div>
        <div className="paraduenos-cta-final-imagen" />
      </section>

    </div>
  );
};