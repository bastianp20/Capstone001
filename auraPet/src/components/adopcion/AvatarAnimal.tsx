import { useState } from "react";
import { ICONO_ESPECIE_ADOPCION } from "../../constants";
import type { AvatarAnimalProps } from "../../interfaces";

/** Foto del animal o, si no tiene (o no carga), un fondo pastel con el ícono de su especie. */
export const AvatarAnimal = ({ especie, fotoUrl, nombre, tono, tamanoIcono = 48, className = "" }: AvatarAnimalProps) => {
  const Icono = ICONO_ESPECIE_ADOPCION[especie];
  const [fallida, setFallida] = useState<string | null>(null);
  const mostrarFoto = fotoUrl && fallida !== fotoUrl;
  return (
    <div className={`adopta-avatar ${className}`} style={{ background: tono }}>
      {mostrarFoto ? (
        <img src={fotoUrl} alt={nombre} loading="lazy" onError={() => setFallida(fotoUrl)} />
      ) : (
        <Icono size={tamanoIcono} strokeWidth={1.5} aria-hidden />
      )}
    </div>
  );
};
