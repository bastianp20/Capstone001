import { useState } from "react";
import { Mail, MessageCircle, MapPin, ChevronDown } from "lucide-react";
import { ASUNTOS_CONTACTO, Colors, CONTACTO_VACIO, LIMITES_CONTACTO, OTRAS_FORMAS_CONTACTO, TEXTOS_CONTACTO } from "../../constants";
import { useFormularioContacto } from "../../hooks/useFormularioContacto";
import "../../css/Contacto.css";
import { usePreguntasFrecuentes } from "../../hooks/usePreguntasFrecuentes";

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

export const ContactoScreen = () => {
  const { formulario, cambiar, enviar, enviado, ocupado, mensajeError } = useFormularioContacto(CONTACTO_VACIO);
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);
  const { preguntas: preguntasFrecuentes } = usePreguntasFrecuentes();

  return (
    <div className="contacto-page" style={temaVars}>

      {/* Hero */}
      <header className="contacto-hero">
        <h1>¿Tienes dudas? Hablemos</h1>
        <p>Estamos para ayudarte a resolver cualquier consulta sobre AuraPet</p>
      </header>

      {/* Formulario + datos de contacto */}
      <section className="contacto-principal">
        <form className="contacto-form" onSubmit={enviar}>
          <label className="contacto-label" htmlFor="contacto-nombre">Nombre</label>
          <input
            id="contacto-nombre"
            type="text"
            placeholder="Nombre"
            value={formulario.nombre}
            onChange={(e) => cambiar({ nombre: e.target.value })}
            maxLength={LIMITES_CONTACTO.nombreMax}
            autoComplete="name"
            required
          />

          <label className="contacto-label" htmlFor="contacto-correo">Correo electrónico</label>
          <input
            id="contacto-correo"
            type="email"
            placeholder="Correo electrónico"
            value={formulario.correo}
            onChange={(e) => cambiar({ correo: e.target.value })}
            maxLength={LIMITES_CONTACTO.correoMax}
            autoComplete="email"
            required
          />

          <label className="contacto-label" htmlFor="contacto-asunto">Asunto</label>
          <select
            id="contacto-asunto"
            value={formulario.asunto}
            onChange={(e) => cambiar({ asunto: e.target.value })}
          >
            {ASUNTOS_CONTACTO.map((a) => <option key={a}>{a}</option>)}
          </select>

          <label className="contacto-label" htmlFor="contacto-mensaje">Mensaje</label>
          <textarea
            id="contacto-mensaje"
            placeholder="Mensaje"
            value={formulario.mensaje}
            onChange={(e) => cambiar({ mensaje: e.target.value })}
            maxLength={LIMITES_CONTACTO.mensajeMax}
            required
          />

          {mensajeError && <p className="contacto-estado contacto-estado--error" role="alert">{mensajeError}</p>}
          {enviado && <p className="contacto-estado contacto-estado--ok" role="status">{TEXTOS_CONTACTO.enviado}</p>}

          <button type="submit" className="landing-btn-primario" disabled={ocupado}>
            {ocupado ? TEXTOS_CONTACTO.enviando : TEXTOS_CONTACTO.enviar}
          </button>
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
          {OTRAS_FORMAS_CONTACTO.map((item) => {
            const Icono = item.icono;
            return (
              <div className="contacto-otras-card" key={item.titulo}>
                <div className="contacto-otras-icono">
                  <Icono size={20} color={colors.primario} />
                </div>
                <h3>{item.titulo}</h3>
                <p>{item.descripcion}</p>
                <a href={`mailto:${item.correo}`}>{item.correo}</a>
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
              <ChevronDown size={16} className={`contacto-faq-flecha ${faqAbierta === i ? "contacto-faq-flecha--abierta" : ""}`} />
            </button>
            {faqAbierta === i && <p className="contacto-faq-respuesta">{item.respuesta}</p>}
          </div>
        ))}
      </section>
    </div>
  );
};