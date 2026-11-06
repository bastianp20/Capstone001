import { Camera } from "lucide-react";
import { useRef } from "react";
import { MAX_DESCRIPCION_REFUGIO, REGIONES_CHILE, TEXTOS_MODAL_REFUGIO as TM, TEXTOS_POSTULAR_REFUGIO as T, TIPOS_FOTO_ADOPCION } from "../../../../constants";
import type { PasoTuRefugioProps } from "../../../../interfaces";
import { CampoSelectAdopcion } from "../../formulario/CampoSelectAdopcion";
import { CampoTextoAdopcion } from "../../formulario/CampoTextoAdopcion";
import { CampoComunaRefugio } from "../gestion/CampoComunaRefugio";
import { LogoRefugio } from "../gestion/LogoRefugio";

/** Paso 1: logo (opcional, con recorte), nombre, región, comuna y descripción. */
export const PasoTuRefugio = ({ datos, errores, onCambiar, onLogo, errorLogo }: PasoTuRefugioProps) => {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="pr-paso">
      <h2>{T.tituloPaso1}</h2>
      <div className="pr-logo">
        <button type="button" className="pr-logo-boton" onClick={() => input.current?.click()} aria-label={T.logo}>
          <LogoRefugio nombre={datos.nombre} logoUrl={datos.logo.vista} tamano="grande" />
          <span className="pr-logo-camara" aria-hidden>
            <Camera size={14} />
          </span>
        </button>
        <div>
          <strong>{T.logo}</strong>
          <small>{T.logoAyuda}</small>
          <button type="button" className="ap-btn ap-btn-borde ap-btn-chico" onClick={() => input.current?.click()}>
            {datos.logo.vista ? T.cambiarLogo : T.subirLogo}
          </button>
        </div>
        <input
          ref={input}
          type="file"
          accept={TIPOS_FOTO_ADOPCION.join(",")}
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) onLogo(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </div>
      {errorLogo && <p className="adopta-campo-error" role="alert">{errorLogo}</p>}

      <CampoTextoAdopcion id="postular-nombre" etiqueta={TM.nombre} valor={datos.nombre} onCambiar={(v) => onCambiar("nombre", v)} error={errores.nombre} maximo={80} />
      <div className="pr-fila">
        <CampoSelectAdopcion
          id="postular-region"
          etiqueta={TM.region}
          valor={datos.region}
          opciones={REGIONES_CHILE.map((r) => ({ valor: r, label: r }))}
          onCambiar={(v) => onCambiar("region", v)}
          error={errores.region}
        />
        <CampoComunaRefugio id="postular-comuna" etiqueta={TM.comuna} region={datos.region} valor={datos.comuna} onCambiar={(v) => onCambiar("comuna", v)} error={errores.comuna} />
      </div>
      <CampoTextoAdopcion
        id="postular-descripcion"
        etiqueta={TM.descripcion}
        valor={datos.descripcion}
        onCambiar={(v) => onCambiar("descripcion", v)}
        placeholder={TM.descripcionPlaceholder}
        multilinea
        maximo={MAX_DESCRIPCION_REFUGIO}
      />
    </div>
  );
};
