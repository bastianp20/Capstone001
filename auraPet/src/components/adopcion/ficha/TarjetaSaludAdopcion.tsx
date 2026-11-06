import { Check, Minus, Pill, Scale } from "lucide-react";
import { TEXTOS_FICHA_ADOPCION as T } from "../../../constants";
import type { TarjetaSaludAdopcionProps } from "../../../interfaces";
import { ItemSaludAdopcion } from "./ItemSaludAdopcion";

/** Vacunas, esterilización, microchip, peso y alergias. */
export const TarjetaSaludAdopcion = ({ ficha }: TarjetaSaludAdopcionProps) => {
  const marca = (ok: boolean) => (ok ? <Check size={18} /> : <Minus size={18} />);
  return (
    <section className="ficha-tarjeta">
      <h2>{T.salud}</h2>
      <ul className="ficha-salud">
        <ItemSaludAdopcion icono={marca(ficha.vacunasAlDia)} etiqueta={ficha.vacunasAlDia ? T.vacunas : T.vacunasPendientes} pendiente={!ficha.vacunasAlDia} />
        <ItemSaludAdopcion
          icono={marca(ficha.esterilizado)}
          etiqueta={ficha.esterilizado ? T.esterilizado(ficha.sexo) : T.sinEsterilizar}
          pendiente={!ficha.esterilizado}
        />
        <ItemSaludAdopcion icono={marca(ficha.conMicrochip)} etiqueta={ficha.conMicrochip ? T.microchip : T.sinMicrochip} pendiente={!ficha.conMicrochip} />
        <ItemSaludAdopcion icono={<Scale size={18} />} etiqueta={T.peso} valor={ficha.pesoKg ? `${ficha.pesoKg} kg` : T.sinDato} />
        <ItemSaludAdopcion icono={<Pill size={18} />} etiqueta={T.alergias} valor={ficha.alergias ?? T.sinAlergias} />
      </ul>
    </section>
  );
};
