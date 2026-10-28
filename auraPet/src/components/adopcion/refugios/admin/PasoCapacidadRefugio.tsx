import { TEXTOS_MODAL_REFUGIO as T } from "../../../../constants";
import type { PasoRefugioProps } from "../../../../interfaces";
import { BarraOcupacion } from "../gestion/BarraOcupacion";
import { ContadorNumero } from "../gestion/ContadorNumero";
import { SelectorEspecies } from "../gestion/SelectorEspecies";
import { SelectorRecepcion } from "../gestion/SelectorRecepcion";

/** Paso 2: cupos, si recibe animales y qué especies. */
export const PasoCapacidadRefugio = ({ datos, errores, onCambiar }: PasoRefugioProps) => (
  <div className="ra-paso">
    <div className="ra-contadores">
      <ContadorNumero etiqueta={T.cuposTotales} valor={datos.cuposTotales} onCambiar={(v) => onCambiar("cuposTotales", v)} grande />
      <ContadorNumero etiqueta={T.cuposOcupados} valor={datos.cuposOcupados} maximo={datos.cuposTotales} onCambiar={(v) => onCambiar("cuposOcupados", v)} grande />
    </div>
    <BarraOcupacion ocupados={datos.cuposOcupados} totales={datos.cuposTotales} />
    {errores.cuposOcupados && <p className="adopta-campo-error">{errores.cuposOcupados}</p>}
    <fieldset className="adopta-campo">
      <legend>{T.recibe}</legend>
      <SelectorRecepcion valor={datos.recibe} onCambiar={(v) => onCambiar("recibe", v)} />
    </fieldset>
    <fieldset className="adopta-campo">
      <legend>{T.especies}</legend>
      <SelectorEspecies valor={datos.especies} onCambiar={(v) => onCambiar("especies", v)} error={errores.especies} />
    </fieldset>
  </div>
);
