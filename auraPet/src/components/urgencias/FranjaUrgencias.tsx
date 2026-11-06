import { Link } from "react-router-dom";
import { Iconos, RUTA_URGENCIAS, TEXTOS_URGENCIAS as T } from "../../constants";
import "../../css/UrgenciasPage.css";

// Franja de la portada: quien tiene una urgencia llega a /urgencias sin cuenta.
export const FranjaUrgencias = () => (
  <section className="urg-franja" aria-label={T.franjaTitulo}>
    <div className="urg-franja-texto">
      <span className="urg-franja-icono" aria-hidden="true"><Iconos.telefono size={22} /></span>
      <div>
        <h2>{T.franjaTitulo}</h2>
        <p>{T.franjaTexto}</p>
      </div>
    </div>
    <Link to={RUTA_URGENCIAS} className="urg-boton-rojo">
      {T.franjaBoton} <Iconos.siguiente size={18} aria-hidden="true" />
    </Link>
  </section>
);
