import './MatchSection.css'

function MatchSection() {
  return (
    <section className="section" id="match">
      <div className="wrap">
        <div className="match">
          <div className="match-copy">
            <div className="kicker">Machine Learning & Deep Learning</div>
            <h2>Un match pensado para que la adopción funcione</h2>
            <p>El modelo aprende de variables como espacio disponible, nivel de actividad, experiencia previa y compatibilidad de temperamento para sugerir la mascota ideal.</p>
            <div className="match-points">
              <span>
                <i className="check">✓</i> Recomendación basada en perfil del hogar y de la mascota
              </span>
              <span>
                <i className="check">✓</i> Reduce devoluciones y abandonos post-adopción
              </span>
              <span>
                <i className="check">✓</i> Aprende de datos entregados por refugios y veterinarias
              </span>
            </div>
            <a className="btn btn-outline-white">Conocer el modelo →</a>
          </div>
          <div className="match-card">
            <div className="match-score-row">
              <div className="name">🐕 Luna · Mestiza, 2 años</div>
              <div className="score">98% match</div>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '98%' }}></div>
            </div>

            <div className="match-score-row">
              <div className="name">🐈 Michi · Común europeo</div>
              <div className="score">86% match</div>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '86%' }}></div>
            </div>

            <div className="match-score-row">
              <div className="name">🐕 Toby · Beagle, 4 años</div>
              <div className="score">71% match</div>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '71%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MatchSection
