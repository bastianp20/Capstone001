import { LogIn, UserRoundCheck } from "lucide-react";
import { TEXTOS_POSTULAR_REFUGIO as T } from "../../../../constants";
import type { AvisoCuentaPostulacionProps } from "../../../../interfaces";

/** Arriba del formulario: a nombre de quién queda, o la invitación a ingresar si ya tiene cuenta. */
export const AvisoCuentaPostulacion = ({ nombre, onIngresar }: AvisoCuentaPostulacionProps) =>
  nombre ? (
    <p className="pr-cuenta pr-cuenta-con">
      <UserRoundCheck size={18} aria-hidden /> {T.conCuenta(nombre)}
    </p>
  ) : (
    <div className="pr-cuenta">
      <div>
        <strong>{T.sinCuentaTitulo}</strong>
        <span>{T.sinCuentaTexto}</span>
      </div>
      <button type="button" className="ap-btn ap-btn-borde ap-btn-chico" onClick={onIngresar}>
        <LogIn size={15} aria-hidden /> {T.ingresar}
      </button>
    </div>
  );
