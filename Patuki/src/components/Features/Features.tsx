import './Features.css'

function Features() {
  return (
    <section className="section" id="producto">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">Producto</div>
          <h2>Todo el ecosistema, en un solo sistema</h2>
          <p>Un portal para veterinarias y refugios, una app para dueños, y un motor de recomendación que conecta a ambos.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon icon-teal">🩺</div>
            <h3>Historial médico unificado</h3>
            <p>Vacunas, tratamientos, exámenes y controles quedan registrados por la veterinaria y visibles al instante para el dueño.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-coral">📱</div>
            <h3>App móvil para dueños</h3>
            <p>Construida en React Native + Expo: notificaciones de citas, recordatorios de vacunas y acceso a la ficha de cada mascota.</p>
          </div>
          <div className="feature-card" style={{ background: 'linear-gradient(180deg,#fff,var(--coral-soft))' }}>
            <div className="feature-icon" style={{ background: '#fde3c7', color: '#8a5a12' }}>
              🧠
            </div>
            <h3>Match de adopción con IA</h3>
            <p>Un modelo de ML/DL sugiere la mascota más compatible según espacio, tiempo disponible, experiencia y estilo de vida.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-teal">🏠</div>
            <h3>Red de refugios</h3>
            <p>Refugios y centros de rescate publican mascotas disponibles y gestionan procesos de adopción de forma centralizada.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon icon-coral">🔔</div>
            <h3>Recordatorios automáticos</h3>
            <p>Vacunas, controles y tratamientos con alertas para que ninguna fecha importante se pase por alto.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#e6e1f5', color: '#5b3fa0' }}>
              📊
            </div>
            <h3>Panel para veterinarias</h3>
            <p>Gestión de pacientes, agenda y fichas clínicas desde un panel pensado para el día a día de la clínica.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
