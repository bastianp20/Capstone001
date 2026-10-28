import { MapPin } from "lucide-react";
import { TEXTOS_SOLIDARIA as T, TONOS_ADOPCION } from "../../../constants";
import type { TarjetaUrgenteProps } from "../../../interfaces";
import { AvatarAnimal } from "../AvatarAnimal";
import { BarraEspera } from "./BarraEspera";

/** Tarjeta horizontal de "Más urgentes": quien más lleva esperando atención. */
export const TarjetaUrgente = ({ animal: a, onAtender }: TarjetaUrgenteProps) => (
  <article className="ap-urgente">
    <AvatarAnimal especie={a.especie} fotoUrl={a.fotoUrl} nombre={a.nombre} tono={TONOS_ADOPCION[0]} tamanoIcono={40} className="ap-urgente-foto" />
    <div className="ap-urgente-cuerpo">
      <strong>{a.nombre}</strong>
      <span className="ap-suave">{T.esperandoHace(a.diasEsperando)}</span>
      <BarraEspera dias={a.diasEsperando} />
      <div className="ap-chips">
        {a.refugio && <span className="ap-chip ap-chip-refugio">{a.refugio}</span>}
        {a.enMiComuna && (
          <span className="ap-chip ap-chip-comuna">
            <MapPin size={12} aria-hidden /> {T.enTuComuna}
          </span>
        )}
      </div>
    </div>
    <button type="button" className="ap-btn ap-btn-primario ap-btn-chico" onClick={() => onAtender(a)}>
      {T.atender}
    </button>
  </article>
);
