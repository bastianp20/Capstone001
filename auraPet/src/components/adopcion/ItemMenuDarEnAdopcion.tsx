import { ICONO_DAR_EN_ADOPCION as Icono, TEXTOS_DAR_EN_ADOPCION_PANEL as T } from "../../constants";
import type { ItemMenuDarEnAdopcionProps } from "../../interfaces";

/** Botón "Dar en adopción" para los menús laterales de los paneles (toma las clases de cada menú). */
export const ItemMenuDarEnAdopcion = ({ className, claseTexto, onClick }: ItemMenuDarEnAdopcionProps) => (
  <button type="button" className={className} onClick={onClick}>
    <Icono size={17} aria-hidden="true" />
    <span className={claseTexto}>{T.menu}</span>
  </button>
);
