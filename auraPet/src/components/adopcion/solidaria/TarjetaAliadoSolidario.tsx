import { Medal } from "lucide-react";
import { TEXTOS_SOLIDARIA as T } from "../../../constants";
import type { TarjetaAliadoSolidarioProps } from "../../../interfaces";
import { InterruptorAdopcion } from "../formulario/InterruptorAdopcion";

/** Insignia "Aliado solidario" con su interruptor. */
export const TarjetaAliadoSolidario = ({ activo, ocupado, onCambiar }: TarjetaAliadoSolidarioProps) => (
  <section className={`ap-aliado ${activo ? "ap-aliado-activo" : ""}`} aria-busy={ocupado}>
    <span className="ap-medalla" aria-hidden>
      <Medal size={30} />
    </span>
    <div>
      <strong>{T.aliadoTitulo}</strong>
      <InterruptorAdopcion etiqueta={T.aliadoTexto} activo={activo} onCambiar={(v) => !ocupado && onCambiar(v)} />
      <p className="ap-suave">{T.aliadoDetalle}</p>
    </div>
  </section>
);
