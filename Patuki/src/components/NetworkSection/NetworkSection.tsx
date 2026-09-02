import './NetworkSection.css'

function NetworkSection() {
  return (
    <section className="section" id="red">
      <div className="wrap network-grid">
        <div>
          <div className="kicker">Red de aliados</div>
          <h2>Veterinarias y refugios, conectados</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '16px', marginBottom: '28px' }}>
            Patuki une a distintos actores del cuidado animal en una sola red de información,
            para que cada mascota tenga un historial completo sin importar dónde fue atendida.
          </p>
          <a className="btn btn-primary">Sumar mi organización</a>
        </div>
        <div>
          <div className="network-card">
            <div className="mark icon-teal">🏥</div>
            <div>
              <h4>Clínicas veterinarias</h4>
              <p>Registran atenciones y acceden al historial completo de cada paciente.</p>
            </div>
          </div>
          <div className="network-card">
            <div className="mark icon-coral">🏡</div>
            <div>
              <h4>Refugios y rescates</h4>
              <p>Publican mascotas disponibles y gestionan el proceso de adopción.</p>
            </div>
          </div>
          <div className="network-card">
            <div className="mark" style={{ background: '#e6e1f5', color: '#5b3fa0' }}>
              🐾
            </div>
            <div>
              <h4>Dueños de mascotas</h4>
              <p>Siguen el estado de salud y reciben recomendaciones personalizadas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NetworkSection
