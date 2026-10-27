import { Stethoscope } from "lucide-react";
import { ICONO_ESPECIE_ADOPCION, TEXTOS_ADOPCION_LOGIN } from "../../constants";
import type { MiniTarjetaAdopcionProps } from "../../interfaces";

/** Tarjeta chica de un animal en adopción: avatar, nombre, edad, comuna y sello de chequeo. */
export const MiniTarjetaAdopcion = ({ animal, tono }: MiniTarjetaAdopcionProps) => {
  const Icono = ICONO_ESPECIE_ADOPCION[animal.especie];
  return (
    <article className="adopcion-mini" aria-label={`${animal.nombre}, ${animal.edad}, ${animal.comuna}`}>
      {animal.revisadoPorVet && (
        <span className="adopcion-mini-sello">
          <Stethoscope size={11} aria-hidden /> {TEXTOS_ADOPCION_LOGIN.revisado}
        </span>
      )}
      <div className="adopcion-mini-avatar" style={{ background: tono }}>
        {animal.fotoUrl ? <img src={animal.fotoUrl} alt="" /> : <Icono size={30} strokeWidth={1.8} aria-hidden />}
      </div>
      <p className="adopcion-mini-nombre">{animal.nombre}</p>
      <p className="adopcion-mini-detalle">
        {animal.edad} · {animal.comuna}
      </p>
    </article>
  );
};
