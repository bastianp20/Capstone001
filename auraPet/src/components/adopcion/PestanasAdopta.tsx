import { NavLink } from "react-router-dom";
import { RUTA_ADOPTA, RUTA_REFUGIOS, TEXTOS_REFUGIOS as T } from "../../constants";
import type { PestanasAdoptaProps } from "../../interfaces";

/** "Animales · Refugios" bajo el hero de Adopta. */
export const PestanasAdopta = ({ actual }: PestanasAdoptaProps) => (
  <nav className="adopta-pestanas" aria-label="Adopta">
    <NavLink to={RUTA_ADOPTA} end className={actual === "animales" ? "adopta-pestanas-activa" : ""}>
      {T.pestanaAnimales}
    </NavLink>
    <NavLink to={RUTA_REFUGIOS} className={actual === "refugios" ? "adopta-pestanas-activa" : ""}>
      {T.pestanaRefugios}
    </NavLink>
  </nav>
);
