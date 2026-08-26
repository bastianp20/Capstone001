import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-blob"></div>
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">🐶 Portal veterinario + app de dueños</div>
          <h1>
            La historia clínica de tu mascota, <span className="hl">siempre a mano</span>.
          </h1>
          <p className="lead">
            Patuki conecta veterinarias, refugios y dueños en un solo lugar: historial médico
            centralizado, seguimiento desde el celular y un modelo de IA que ayuda a encontrar
            la adopción perfecta según el estilo de vida de cada familia.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary">Comenzar gratis</a>
            <a className="btn btn-ghost">Ver cómo funciona →</a>
          </div>
          <div className="trust-row">
            <span>
              <i className="dot"></i> Historial clínico digital
            </span>
            <span>
              <i className="dot"></i> App para dueños (Expo)
            </span>
            <span>
              <i className="dot"></i> Match por IA
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="phone-card">
            <div className="phone-topbar">
              <div className="avatar"></div>
              <div>
                <div className="phone-name">Firulais 🐕</div>
                <div className="phone-sub">Labrador · 3 años · Control al día</div>
              </div>
            </div>
            <div className="pet-row">
              <div>
                <div className="pname">Vacuna antirrábica</div>
                <div className="ptag">Última dosis: 12 mar 2026</div>
              </div>
              <div className="pill pill-green">Al día</div>
            </div>
            <div className="pet-row">
              <div>
                <div className="pname">Control de peso</div>
                <div className="ptag">Próximo chequeo: 03 sep 2026</div>
              </div>
              <div className="pill pill-amber">Pendiente</div>
            </div>
            <div className="pet-row">
              <div>
                <div className="pname">Desparasitación</div>
                <div className="ptag">Clínica VetSur · Dra. Rojas</div>
              </div>
              <div className="pill pill-green">Al día</div>
            </div>
          </div>
          <div className="float-card float-1">
            <div className="float-icon icon-teal">📋</div>
            <div>
              <div className="float-title">Ficha clínica</div>
              <div className="float-sub">Sincronizada en tiempo real</div>
            </div>
          </div>
          <div className="float-card float-2">
            <div className="float-icon icon-coral">🤖</div>
            <div>
              <div className="float-title">98% match</div>
              <div className="float-sub">Con familia adoptante</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
