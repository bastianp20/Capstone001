import { TAMANO_ADOPCION_LABEL } from "../../../constants";
import type { CabeceraFichaAdopcionProps } from "../../../interfaces";

/** Nombre, datos básicos, historia y la frase del animal. */
export const CabeceraFichaAdopcion = ({ ficha }: CabeceraFichaAdopcionProps) => (
  <div className="ficha-cabecera">
    <h1>{ficha.nombre}</h1>
    <p className="ficha-datos">
      {[ficha.raza.toLowerCase(), ficha.edad, TAMANO_ADOPCION_LABEL[ficha.tamano], ficha.comuna].join(" · ")}
    </p>
    {ficha.historia && <p className="ficha-historia">{ficha.historia}</p>}
    {ficha.frase && <blockquote className="ficha-frase">“{ficha.frase}”</blockquote>}
  </div>
);
