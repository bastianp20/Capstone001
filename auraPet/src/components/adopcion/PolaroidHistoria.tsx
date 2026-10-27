import type { PolaroidHistoriaProps } from "../../interfaces";
import { AvatarAnimal } from "./AvatarAnimal";

/** Historia de éxito como polaroid ligeramente girada. */
export const PolaroidHistoria = ({ historia, giro, tono }: PolaroidHistoriaProps) => (
  <figure className="adopta-polaroid" style={{ transform: `rotate(${giro}deg)` }}>
    <AvatarAnimal especie={historia.especie} fotoUrl={historia.fotoUrl} nombre={historia.nombre} tono={tono} tamanoIcono={64} className="adopta-polaroid-foto" />
    <figcaption>
      <strong>{historia.nombre}</strong>
      <span>“{historia.frase}”</span>
      <small>— {historia.adoptante}</small>
    </figcaption>
  </figure>
);
