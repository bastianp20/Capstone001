import type { ItemSaludAdopcionProps } from "../../../interfaces";

/** Un dato de salud con ícono: "✓ Vacunas al día", "Peso 18 kg". */
export const ItemSaludAdopcion = ({ icono, etiqueta, valor, pendiente = false }: ItemSaludAdopcionProps) => (
  <li className={`ficha-salud-item ${pendiente ? "ficha-salud-pendiente" : ""}`}>
    <span className="ficha-salud-icono" aria-hidden>
      {icono}
    </span>
    <span>
      {etiqueta}
      {valor && <strong>{valor}</strong>}
    </span>
  </li>
);
