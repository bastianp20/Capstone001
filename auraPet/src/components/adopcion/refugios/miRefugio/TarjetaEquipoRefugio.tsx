import { Link } from "react-router-dom";
import { TEXTOS_MI_REFUGIO as T } from "../../../../constants";
import type { TarjetaEquipoRefugioProps } from "../../../../interfaces";
import { iniciales } from "../../../../lib/publicacionesAdopcion";

/** Quiénes administran el refugio. */
export const TarjetaEquipoRefugio = ({ equipo }: TarjetaEquipoRefugioProps) => (
  <section className="ap-tarjeta mr-equipo">
    <h2>{T.equipo}</h2>
    <ul>
      {equipo.map((m) => (
        <li key={m.id}>
          <span className="ap-avatar ap-avatar-chico" aria-hidden>
            {iniciales(m.nombre)}
          </span>
          {m.nombre}
        </li>
      ))}
    </ul>
    <p className="ap-suave">
      {T.sumarAlguien} <Link to="/contacto">{T.escribenos}</Link>
    </p>
  </section>
);
