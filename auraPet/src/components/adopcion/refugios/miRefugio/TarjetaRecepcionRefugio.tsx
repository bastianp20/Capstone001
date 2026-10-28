import { TEXTOS_MI_REFUGIO as T } from "../../../../constants";
import type { TarjetaRecepcionRefugioProps } from "../../../../interfaces";
import { SelectorRecepcion } from "../gestion/SelectorRecepcion";

/** ¿Recibes animales hoy? (se guarda al elegir) */
export const TarjetaRecepcionRefugio = ({ valor, ocupado, onCambiar }: TarjetaRecepcionRefugioProps) => (
  <section className="ap-tarjeta mr-recepcion">
    <h2>{T.recibesHoy}</h2>
    <SelectorRecepcion valor={valor} onCambiar={onCambiar} deshabilitado={ocupado} />
    <small className="ap-suave">{T.recibesAyuda}</small>
  </section>
);
