import { MAX_DESCRIPCION_REFUGIO, REGIONES_CHILE, TEXTOS_MODAL_REFUGIO as T } from "../../../../constants";
import type { PasoDatosRefugioProps } from "../../../../interfaces";
import { CampoSelectAdopcion } from "../../formulario/CampoSelectAdopcion";
import { CampoTextoAdopcion } from "../../formulario/CampoTextoAdopcion";
import { InterruptorAdopcion } from "../../formulario/InterruptorAdopcion";
import { CampoComunaRefugio } from "../gestion/CampoComunaRefugio";
import { CampoImagenesRefugio } from "../gestion/CampoImagenesRefugio";
import { CampoTelefono } from "../gestion/CampoTelefono";

/** Paso 1: portada, logo, nombre, región, comuna, contacto, descripción y "de prueba". */
export const PasoDatosRefugio = ({ datos, errores, onCambiar, onLogo, onPortada, errorImagen }: PasoDatosRefugioProps) => (
  <div className="ra-paso">
    <CampoImagenesRefugio nombre={datos.nombre} logo={datos.logo} portada={datos.portada} onLogo={onLogo} onPortada={onPortada} error={errorImagen ?? undefined} />
    <CampoTextoAdopcion id="refugio-nombre" etiqueta={T.nombre} valor={datos.nombre} onCambiar={(v) => onCambiar("nombre", v)} error={errores.nombre} maximo={80} />
    <div className="ra-fila-campos">
      <CampoSelectAdopcion
        id="refugio-region"
        etiqueta={T.region}
        valor={datos.region}
        opciones={REGIONES_CHILE.map((r) => ({ valor: r, label: r }))}
        onCambiar={(v) => onCambiar("region", v)}
        error={errores.region}
      />
      <CampoComunaRefugio id="refugio-comuna" etiqueta={T.comuna} region={datos.region} valor={datos.comuna} onCambiar={(v) => onCambiar("comuna", v)} error={errores.comuna} />
    </div>
    <div className="ra-fila-campos">
      <CampoTelefono id="refugio-telefono" etiqueta={T.telefono} valor={datos.telefono} onCambiar={(v) => onCambiar("telefono", v)} error={errores.telefono} />
      <CampoTextoAdopcion id="refugio-correo" etiqueta={T.correo} valor={datos.correo} onCambiar={(v) => onCambiar("correo", v)} error={errores.correo} placeholder="contacto@refugio.cl" />
    </div>
    <CampoTextoAdopcion
      id="refugio-descripcion"
      etiqueta={T.descripcion}
      valor={datos.descripcion}
      onCambiar={(v) => onCambiar("descripcion", v)}
      placeholder={T.descripcionPlaceholder}
      multilinea
      maximo={MAX_DESCRIPCION_REFUGIO}
    />
    <div className="ra-caja-prueba">
      <InterruptorAdopcion etiqueta={T.prueba} activo={datos.esPrueba} onCambiar={(v) => onCambiar("esPrueba", v)} />
      <small className="ap-suave">{T.pruebaAyuda}</small>
    </div>
  </div>
);
