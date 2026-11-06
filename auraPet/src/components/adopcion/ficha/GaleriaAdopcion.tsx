import { useState } from "react";
import { TONOS_ADOPCION } from "../../../constants";
import type { GaleriaAdopcionProps } from "../../../interfaces";
import { AvatarAnimal } from "../AvatarAnimal";

/** Foto grande y miniaturas para cambiarla. Sin fotos, el ícono de la especie. */
export const GaleriaAdopcion = ({ fotos, nombre, especie }: GaleriaAdopcionProps) => {
  const [elegida, setElegida] = useState(0);
  const actual = fotos[elegida] ?? fotos[0] ?? null;

  return (
    <div className="ficha-galeria">
      <AvatarAnimal especie={especie} fotoUrl={actual} nombre={nombre} tono={TONOS_ADOPCION[0]} tamanoIcono={110} className="ficha-galeria-principal" />
      {fotos.length > 1 && (
        <div className="ficha-galeria-miniaturas">
          {fotos.map((f, i) => (
            <button
              key={f}
              type="button"
              className={`ficha-miniatura ${i === elegida ? "ficha-miniatura-activa" : ""}`}
              onClick={() => setElegida(i)}
              aria-label={`Foto ${i + 1} de ${nombre}`}
              aria-pressed={i === elegida}
            >
              <img src={f} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
