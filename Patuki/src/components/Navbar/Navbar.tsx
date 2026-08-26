import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="logo">
          <div className="logo-mark">🐾</div>
          Patuki
        </div>
        <nav className="links">
          <a href="#producto">Producto</a>
          <a href="#match">Match IA</a>
          <a href="#red">Red de aliados</a>
          <a href="#testimonios">Testimonios</a>
        </nav>
        <div className="nav-cta">
          <Link to="/panel" className="btn btn-ghost">
            Panel de datos
          </Link>
          <a className="btn btn-primary">Solicitar demo</a>
        </div>
      </div>
    </header>
  )
}

export default Navbar
