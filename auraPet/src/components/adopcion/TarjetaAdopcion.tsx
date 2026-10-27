import { ArrowRight, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { TEXTOS_ADOPCION as T } from "../../constants";
import type { TarjetaAdopcionProps } from "../../interfaces";
import { AvatarAnimal } from "./AvatarAnimal";
import { SelloRevisado } from "./SelloRevisado";

/** Tarjeta de la grilla: la foto manda y encima van el nombre, la edad y lo justo. */
export const TarjetaAdopcion = ({ animal, alto, tono, onConocer }: TarjetaAdopcionProps) => {
  const enProceso = animal.estado === "en_proceso";
  return (
    <article
      className={`adopta-tarjeta ${enProceso ? "adopta-tarjeta-en-proceso" : ""} ${animal.fotoUrl ? "" : "adopta-tarjeta-sin-foto"}`}
      style={{ "--alto": `${alto}px` } as CSSProperties}
    >
      <AvatarAnimal especie={animal.especie} fotoUrl={animal.fotoUrl} nombre={animal.nombre} tono={tono} tamanoIcono={84} className="adopta-tarjeta-foto" />
      {enProceso && <span className="adopta-cinta">{T.enProceso}</span>}
      {animal.chequeo && (
        <div className="adopta-tarjeta-sello">
          <SelloRevisado chequeo={animal.chequeo} />
        </div>
      )}
      <div className="adopta-tarjeta-info">
        <h3>
          {animal.nombre} <span>· {animal.edad}</span>
        </h3>
        <p className="adopta-tarjeta-comuna">
          <MapPin size={13} aria-hidden /> {animal.comuna}
        </p>
        {animal.personalidad[0] && <span className="adopta-etiqueta adopta-etiqueta-clara">{animal.personalidad[0]}</span>}
        {onConocer && !enProceso && (
          <button type="button" className="adopta-tarjeta-conocer" onClick={() => onConocer(animal)}>
            {T.conocer(animal.nombre)} <ArrowRight size={15} aria-hidden />
          </button>
        )}
      </div>
    </article>
  );
};
