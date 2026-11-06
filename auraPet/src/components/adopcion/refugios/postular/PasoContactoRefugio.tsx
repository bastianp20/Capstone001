import { ShieldCheck } from "lucide-react";
import { MAX_MENSAJE_POSTULACION, TEXTOS_POSTULAR_REFUGIO as T } from "../../../../constants";
import type { PasoContactoRefugioProps } from "../../../../interfaces";
import { CampoTextoAdopcion } from "../../formulario/CampoTextoAdopcion";
import { CampoTelefono } from "../gestion/CampoTelefono";

/** Paso 3: quién responde por el refugio y cómo le escribimos (sin cuenta, el correo es el acceso). */
export const PasoContactoRefugio = ({ datos, errores, onCambiar, conSesion }: PasoContactoRefugioProps) => (
  <div className="pr-paso">
    <h2>{T.tituloPaso3}</h2>
    <CampoTextoAdopcion
      id="postular-responsable"
      etiqueta={T.responsable}
      valor={datos.responsable}
      onCambiar={(v) => onCambiar("responsable", v)}
      placeholder={T.responsablePlaceholder}
      error={errores.responsable}
      maximo={80}
    />
    <div className="pr-fila">
      <CampoTelefono id="postular-telefono" etiqueta={T.telefono} valor={datos.telefono} onCambiar={(v) => onCambiar("telefono", v)} error={errores.telefono} />
      <CampoTextoAdopcion
        id="postular-correo"
        etiqueta={conSesion ? T.correo : T.correoAcceso}
        valor={datos.correo}
        onCambiar={(v) => onCambiar("correo", v)}
        error={errores.correo}
        placeholder="contacto@refugio.cl"
      />
    </div>
    <p className="pr-nota">
      <ShieldCheck size={16} aria-hidden /> {conSesion ? T.contactoAyuda : T.correoAccesoAyuda}
    </p>
    <CampoTextoAdopcion
      id="postular-sitio"
      etiqueta={T.sitioWeb}
      valor={datos.sitioWeb}
      onCambiar={(v) => onCambiar("sitioWeb", v)}
      placeholder={T.sitioWebPlaceholder}
      error={errores.sitioWeb}
      maximo={200}
    />
    <CampoTextoAdopcion
      id="postular-mensaje"
      etiqueta={T.mensaje}
      valor={datos.mensaje}
      onCambiar={(v) => onCambiar("mensaje", v)}
      placeholder={T.mensajePlaceholder}
      multilinea
      maximo={MAX_MENSAJE_POSTULACION}
    />
  </div>
);
