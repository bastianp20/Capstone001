import { ESPECIE_ADOPCION_LABEL, TEXTOS_MI_REFUGIO as T } from "../../../../constants";
import type { TarjetaAnimalRefugioProps } from "../../../../interfaces";
import { AvatarAnimal } from "../../AvatarAnimal";

/** Foto grande del animal con sus postulaciones encima. */
export const TarjetaAnimalRefugio = ({ animal: a, tono, onVerPostulaciones }: TarjetaAnimalRefugioProps) => (
  <article className="mr-animal">
    <div className="mr-animal-foto">
      <AvatarAnimal especie={a.especie} fotoUrl={a.fotoUrl} nombre={a.nombre} tono={tono} tamanoIcono={48} />
      {a.postulaciones > 0 && (
        <span className={`mr-animal-chip ${a.nuevas ? "mr-animal-chip-nuevas" : ""}`}>{T.postulacionesChip(a.postulaciones)}</span>
      )}
    </div>
    <div className="mr-animal-cuerpo">
      <h3>{a.nombre}</h3>
      <p className="ap-suave">
        {ESPECIE_ADOPCION_LABEL[a.especie]} · {a.edad}
      </p>
      <button type="button" className="ap-btn ap-btn-borde ap-btn-chico" onClick={() => onVerPostulaciones(a)}>
        {T.verPostulaciones}
      </button>
    </div>
  </article>
);
