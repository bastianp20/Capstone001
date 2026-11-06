import { TEXTOS_ADOPCION as T, TONOS_ADOPCION } from "../../constants";
import type { TarjetaDestacadaAdopcionProps } from "../../interfaces";
import { AvatarAnimal } from "./AvatarAnimal";
import { SelloRevisado } from "./SelloRevisado";

/** "Esta semana te presentamos a…": un animal en grande, con su frase y su chequeo. */
export const TarjetaDestacadaAdopcion = ({ animal, onConocer }: TarjetaDestacadaAdopcionProps) => (
  <section className="adopta-destacado-seccion">
    <h2 className="adopta-subtitulo">{T.destacadoTitulo}</h2>
    <article className="adopta-destacado">
      <AvatarAnimal especie={animal.especie} fotoUrl={animal.fotoUrl} nombre={animal.nombre} tono={TONOS_ADOPCION[0]} tamanoIcono={96} className="adopta-destacado-foto" />
      <div className="adopta-destacado-cuerpo">
        <div className="adopta-destacado-cabecera">
          <div>
            <h3>{animal.nombre}</h3>
            <p className="adopta-destacado-datos">
              {animal.raza} · {animal.edad} · {animal.comuna}
            </p>
          </div>
          {animal.chequeo && <SelloRevisado chequeo={animal.chequeo} completo />}
        </div>
        {animal.frase && <blockquote>“{animal.frase}”</blockquote>}
        <div className="adopta-etiquetas">
          {animal.personalidad.map((p) => (
            <span key={p} className="adopta-etiqueta">
              {p}
            </span>
          ))}
        </div>
        {onConocer && (
          <button type="button" className="adopta-btn adopta-btn-primario adopta-destacado-btn" onClick={() => onConocer(animal)}>
            {T.conocer(animal.nombre)}
          </button>
        )}
      </div>
    </article>
  </section>
);
