import { MapPin } from "lucide-react";
import type { TarjetaOtroAdopcionProps } from "../../../interfaces";
import { AvatarAnimal } from "../AvatarAnimal";

/** Tarjeta chica de "Otros que también buscan hogar". Toda la tarjeta es el enlace. */
export const TarjetaOtroAdopcion = ({ animal, tono, onConocer }: TarjetaOtroAdopcionProps) => (
  <button type="button" className="ficha-otro" onClick={() => onConocer(animal)}>
    <AvatarAnimal especie={animal.especie} fotoUrl={animal.fotoUrl} nombre={animal.nombre} tono={tono} tamanoIcono={40} className="ficha-otro-avatar" />
    <strong>{animal.nombre}</strong>
    <span>{animal.edad} · {animal.raza.toLowerCase()}</span>
    <span className="ficha-otro-comuna">
      <MapPin size={12} aria-hidden /> {animal.comuna}
    </span>
  </button>
);
