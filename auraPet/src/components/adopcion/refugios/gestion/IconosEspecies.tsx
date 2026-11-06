import { ESPECIES_REFUGIO } from "../../../../constants";
import type { IconosEspeciesProps } from "../../../../interfaces";

/** Íconos de las especies que recibe un refugio (perro, gato, otros). */
export const IconosEspecies = ({ especies, conTexto = false }: IconosEspeciesProps) => {
  const elegidas = ESPECIES_REFUGIO.filter((e) => especies.includes(e.valor));
  return (
    <span className="ap-especies" aria-label={elegidas.map((e) => e.label).join(", ")}>
      {elegidas.map(({ valor, label, icono: Icono }) => (
        <span key={valor} className="ap-especie" title={label}>
          <Icono size={16} aria-hidden />
          {conTexto && label}
        </span>
      ))}
    </span>
  );
};
