import './Testimonial.css'

function Testimonial() {
  return (
    <section className="section" id="testimonios">
      <div className="wrap">
        <div className="testimonial">
          <div className="stars">★★★★★</div>
          <blockquote>
            "Tener el historial médico de todos los pacientes en un solo sistema, conectado
            con la app de los dueños, nos ahorra tiempo y mejora el seguimiento de cada tratamiento."
          </blockquote>
          <div className="who">
            <div className="avatar"></div>
            <div style={{ textAlign: 'left' }}>
              <div className="who-name">Dra. Camila Rojas</div>
              <div className="who-role">Clínica Veterinaria VetSur</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonial
