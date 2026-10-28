import { CheckCircle2, MapPin } from "lucide-react";
import { TEXTOS_SOLIDARIA as T } from "../../../constants";
import type { TarjetaAnimalVeterinarioProps } from "../../../interfaces";
import { iniciales } from "../../../lib/publicacionesAdopcion";
import { AvatarAnimal } from "../AvatarAnimal";
import { BarraEspera } from "./BarraEspera";

/** Tarjeta vertical de un animal en adopción, vista por un veterinario. */
export const TarjetaAnimalVeterinario = ({ animal: a, tono, onAtender, onVerFicha }: TarjetaAnimalVeterinarioProps) => (
  <article className="ap-animal">
    <div className="ap-animal-foto">
      <AvatarAnimal especie={a.especie} fotoUrl={a.fotoUrl} nombre={a.nombre} tono={tono} tamanoIcono={56} />
      {a.enProceso && <span className="ap-chip ap-chip-en_proceso">{T.enProceso}</span>}
    </div>
    <div className="ap-animal-cuerpo">
      <h3>{a.nombre}</h3>
      <p className="ap-suave">
        {a.raza} · {a.edad} · <MapPin size={12} aria-hidden /> {a.comuna}
      </p>
      <p className="ap-publicador">
        <span className="ap-avatar ap-avatar-chico">{iniciales(a.publicador)}</span>
        {a.publicador}
        {a.refugio && <span className="ap-chip ap-chip-refugio">{T.refugio}</span>}
      </p>
      {a.solicitaAtencion && !a.revisada && (
        <>
          <span className="ap-suave">{T.esperandoHace(a.diasEsperando)}</span>
          <BarraEspera dias={a.diasEsperando} />
        </>
      )}
      <div className="ap-animal-acciones">
        {a.yaAtendi ? (
          <span className="ap-sello">
            <CheckCircle2 size={14} aria-hidden /> {T.yaAtendido}
          </span>
        ) : (
          <button type="button" className="ap-btn ap-btn-primario ap-btn-chico" onClick={() => onAtender(a)}>
            {T.atender}
          </button>
        )}
        <button type="button" className="ap-btn ap-btn-borde ap-btn-chico" onClick={() => onVerFicha(a)}>
          {T.verFicha}
        </button>
      </div>
    </div>
  </article>
);
