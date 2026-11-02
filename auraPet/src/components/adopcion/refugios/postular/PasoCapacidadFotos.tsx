import { TEXTOS_MODAL_REFUGIO as TM, TEXTOS_POSTULAR_REFUGIO as T } from "../../../../constants";
import type { PasoPostularRefugioProps } from "../../../../interfaces";
import { ZonaFotosAdopcion } from "../../formulario/ZonaFotosAdopcion";
import { BarraOcupacion } from "../gestion/BarraOcupacion";
import { ContadorNumero } from "../gestion/ContadorNumero";
import { SelectorEspecies } from "../gestion/SelectorEspecies";
import { SelectorRecepcion } from "../gestion/SelectorRecepcion";

/** Paso 2: cupos, si está recibiendo, especies y fotos del lugar (2 a 6). */
export const PasoCapacidadFotos = ({ datos, errores, onCambiar }: PasoPostularRefugioProps) => (
  <div className="pr-paso">
    <h2>{T.tituloPaso2}</h2>
    <div className="pr-capacidad">
      <div className="pr-fila">
        <ContadorNumero etiqueta={TM.cuposTotales} valor={datos.cuposTotales} onCambiar={(v) => onCambiar("cuposTotales", v)} grande />
        <ContadorNumero etiqueta={TM.cuposOcupados} valor={datos.cuposOcupados} maximo={datos.cuposTotales} onCambiar={(v) => onCambiar("cuposOcupados", v)} grande />
      </div>
      <BarraOcupacion ocupados={datos.cuposOcupados} totales={datos.cuposTotales} />
      {errores.cuposOcupados && <p className="adopta-campo-error">{errores.cuposOcupados}</p>}
    </div>
    <fieldset className="adopta-campo">
      <legend>{T.recibeCompacto}</legend>
      <SelectorRecepcion valor={datos.recibe} onCambiar={(v) => onCambiar("recibe", v)} compacto />
    </fieldset>
    <fieldset className="adopta-campo">
      <legend>{TM.especies}</legend>
      <SelectorEspecies valor={datos.especies} onCambiar={(v) => onCambiar("especies", v)} error={errores.especies} />
    </fieldset>
    <fieldset className="adopta-campo">
      <legend>{T.fotosLugar}</legend>
      <small className="pr-ayuda">{T.fotosAyuda}</small>
      <ZonaFotosAdopcion fotos={datos.fotos} onCambiar={(fotos) => onCambiar("fotos", fotos)} error={errores.fotos} />
    </fieldset>
  </div>
);
