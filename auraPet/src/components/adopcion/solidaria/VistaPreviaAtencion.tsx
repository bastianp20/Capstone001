import { BadgeCheck, Heart } from "lucide-react";
import { TEXTOS_REGISTRAR_ATENCION as T, TEXTOS_SOLIDARIA, TONOS_ADOPCION } from "../../../constants";
import type { VistaPreviaAtencionProps } from "../../../interfaces";
import { AvatarAnimal } from "../AvatarAnimal";

/** "Así se verá en su ficha": la tarjeta del animal con el sello, en vivo. */
export const VistaPreviaAtencion = ({ animal, veterinario, centro, datos }: VistaPreviaAtencionProps) => (
  <div className="ap-vista-atencion">
    <span className="ap-etiqueta-suave">{T.vistaPrevia}</span>
    <article className="ap-vista-tarjeta">
      <div className="ap-vista-foto">
        <AvatarAnimal especie={animal.especie} fotoUrl={animal.fotoUrl} nombre={animal.nombre} tono={TONOS_ADOPCION[1]} tamanoIcono={64} />
        <span className="ap-vista-sello" aria-hidden>
          <BadgeCheck size={30} />
        </span>
      </div>
      <div className="ap-vista-cuerpo">
        <strong>{animal.nombre}</strong>
        <span>{T.revisadoPor(veterinario, centro)}</span>
        {datos.solidario && (
          <span className="ap-chip ap-chip-solidaria">
            <Heart size={12} fill="currentColor" aria-hidden /> {TEXTOS_SOLIDARIA.solidaria}
          </span>
        )}
        {datos.resumen.trim() && <p>{datos.resumen.trim()}</p>}
      </div>
    </article>
  </div>
);
