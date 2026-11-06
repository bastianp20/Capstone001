import { Heart } from "lucide-react";
import { TEXTOS_MI_REFUGIO as T } from "../../../../constants";
import type { TarjetaEsteMesRefugioProps } from "../../../../interfaces";
import { MiniBarras } from "../../solidaria/MiniBarras";

/** Números del mes y publicaciones de los últimos 6 meses. */
export const TarjetaEsteMesRefugio = ({ publicados, postulaciones, adoptados, porMes }: TarjetaEsteMesRefugioProps) => (
  <section className="ap-tarjeta mr-mes">
    <h2>{T.esteMes}</h2>
    <dl className="mr-mes-numeros">
      <div>
        <dt>{T.publicados}</dt>
        <dd>{publicados}</dd>
      </div>
      <div>
        <dt>{T.postulaciones}</dt>
        <dd>{postulaciones}</dd>
      </div>
      <div className="mr-mes-adoptados">
        <dt>{T.adoptados}</dt>
        <dd>
          {adoptados} <Heart size={16} aria-hidden />
        </dd>
      </div>
    </dl>
    <MiniBarras datos={porMes} />
  </section>
);
