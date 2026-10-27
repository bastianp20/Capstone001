import { ArrowRight, PawPrint } from "lucide-react";
import { TEXTOS_ADOPCION_LOGIN as T } from "../../constants";
import type { FranjaAdopcionLoginProps } from "../../interfaces";

/** Versión celular del apartado de adopción: una franja chica sobre el formulario. */
export const FranjaAdopcionLogin = ({ total, onVerTodos }: FranjaAdopcionLoginProps) => {
  if (!total) return null;
  return (
    <button type="button" className="adopcion-franja" onClick={onVerTodos}>
      <PawPrint size={16} aria-hidden />
      <span>{T.franja(total)}</span>
      <span className="adopcion-franja-ver">
        {T.ver} <ArrowRight size={14} />
      </span>
    </button>
  );
};
