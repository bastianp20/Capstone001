import './Footer.css'

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-mark">🐾</div>
              Patuki
            </div>
            <p>Portal de veterinarias, app para dueños y match de adopción con inteligencia artificial.</p>
          </div>
          <div className="footer-col">
            <h5>Producto</h5>
            <a>Historial médico</a>
            <a>App móvil</a>
            <a>Match IA</a>
          </div>
          <div className="footer-col">
            <h5>Aliados</h5>
            <a>Veterinarias</a>
            <a>Refugios</a>
            <a>Municipalidades</a>
          </div>
          <div className="footer-col">
            <h5>Compañía</h5>
            <a>Sobre Patuki</a>
            <a>Contacto</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Patuki. Mockup visual del proyecto — sin funcionalidades implementadas aún.</span>
          <span>Hecho con 🐾 para el Capstone</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
