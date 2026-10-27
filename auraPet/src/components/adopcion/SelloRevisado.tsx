import { Stethoscope } from "lucide-react";
import { TEXTOS_ADOPCION as T } from "../../constants";
import type { SelloRevisadoProps } from "../../interfaces";

/** Sello verde de confianza: un veterinario de la red revisó al animal. */
export const SelloRevisado = ({ chequeo, completo = false }: SelloRevisadoProps) => {
  if (!completo) {
    return (
      <span className="adopta-sello" title={[T.revisadoPor(chequeo.veterinario), chequeo.centro].filter(Boolean).join(" · ")}>
        <Stethoscope size={14} aria-hidden />
        <span className="adopta-solo-lector">{T.revisadoCorto}</span>
      </span>
    );
  }
  return (
    <div className="adopta-sello-completo">
      <Stethoscope size={18} aria-hidden />
      <div>
        <strong>{T.revisadoPor(chequeo.veterinario)}</strong>
        <span>
          {[chequeo.centro, chequeo.resumen].filter(Boolean).join(" · ")}
        </span>
        {chequeo.solidario && <em>{T.solidario}</em>}
      </div>
    </div>
  );
};
