import './HowItWorks.css'

function HowItWorks() {
  return (
    <section className="section how">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">Cómo funciona</div>
          <h2>De la clínica al celular del dueño</h2>
          <p>Un flujo simple que conecta la atención veterinaria con el seguimiento diario en casa.</p>
        </div>
        <div className="how-grid">
          <div className="how-step">
            <div className="how-num">1</div>
            <h4>Registro clínico</h4>
            <p>La veterinaria crea la ficha del paciente y documenta cada atención.</p>
          </div>
          <div className="how-step">
            <div className="how-num">2</div>
            <h4>Sincronización</h4>
            <p>El historial se actualiza automáticamente en el portal y en la app.</p>
          </div>
          <div className="how-step">
            <div className="how-num">3</div>
            <h4>Seguimiento</h4>
            <p>El dueño recibe recordatorios y revisa el estado de salud desde su celular.</p>
          </div>
          <div className="how-step">
            <div className="how-num">4</div>
            <h4>Adopción inteligente</h4>
            <p>Si buscas adoptar, el modelo de IA sugiere las mascotas más compatibles contigo.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
