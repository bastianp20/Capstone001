import { COMUNAS_SUGERIDAS } from "../../../../constants";
import type { CampoComunaRefugioProps } from "../../../../interfaces";

/** Comuna escrita a mano, con sugerencias cuando la región es la Metropolitana. */
export const CampoComunaRefugio = ({ id, etiqueta, region, valor, onCambiar, error }: CampoComunaRefugioProps) => {
  const lista = `${id}-sugerencias`;
  return (
    <div className="adopta-campo">
      <label htmlFor={id}>{etiqueta}</label>
      <input
        id={id}
        className={`adopta-input ${error ? "adopta-input-error" : ""}`}
        list={region === "Metropolitana" ? lista : undefined}
        value={valor}
        maxLength={60}
        onChange={(e) => onCambiar(e.target.value)}
      />
      <datalist id={lista}>
        {COMUNAS_SUGERIDAS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      {error && <p className="adopta-campo-error">{error}</p>}
    </div>
  );
};
