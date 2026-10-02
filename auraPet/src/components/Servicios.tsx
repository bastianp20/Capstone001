import { Colors, servicios } from "../constants";
import "../css/Servicios.css";

const colors = Colors;

export const Servicios = () => {
  return (
    <section className="landing-seccion" id="servicios">
      <h2>¿Qué puedes hacer en AuraPet?</h2>
      <div className="landing-servicios-grid">
        {servicios.map((servicio) => {
          const Icono = servicio.icono;
          return (
            <div className="landing-servicio-card" key={servicio.titulo}>
              <div className="landing-servicio-icono">
                <Icono size={22} color={colors.primario} />
              </div>
              <h3>{servicio.titulo}</h3>
              <p>{servicio.descripcion}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
