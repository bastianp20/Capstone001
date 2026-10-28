import { TEXTOS_REFUGIOS_ADMIN as T } from "../../../../constants";
import type { AvisoRefugiosPorRevisarProps } from "../../../../interfaces";
import { LogoRefugio } from "../gestion/LogoRefugio";

/** Franja ámbar: "2 refugios esperan verificación" con sus logos. */
export const AvisoRefugiosPorRevisar = ({ refugios, onRevisar }: AvisoRefugiosPorRevisarProps) =>
  refugios.length ? (
    <section className="ra-aviso">
      <strong>{T.esperanVerificacion(refugios.length)}</strong>
      <span className="ra-aviso-logos" aria-hidden>
        {refugios.slice(0, 3).map((r) => (
          <LogoRefugio key={r.id} nombre={r.nombre} logoUrl={r.logoUrl} tamano="chico" />
        ))}
      </span>
      <button type="button" className="ap-btn ra-btn-oscuro ap-btn-chico" onClick={onRevisar}>
        {T.revisarAhora}
      </button>
    </section>
  ) : null;
