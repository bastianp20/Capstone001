import './CTASection.css'

function CTASection() {
  return (
    <section className="section" style={{ paddingTop: '0' }}>
      <div className="wrap">
        <div className="cta">
          <h2>Construyamos juntos el futuro del cuidado animal</h2>
          <p>Portal web, app móvil y modelo de matching por IA, en un solo ecosistema para veterinarias, refugios y dueños.</p>
          <div className="cta-actions">
            <a className="btn btn-primary">Solicitar demo</a>
            <a className="btn btn-outline-white">Hablar con el equipo</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
