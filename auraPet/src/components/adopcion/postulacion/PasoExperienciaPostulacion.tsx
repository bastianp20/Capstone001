import { MAX_TEXTO_POSTULACION, TEXTOS_POSTULACION as T } from "../../../constants";
import type { PasoPostulacionProps } from "../../../interfaces";
import { CampoTextoAdopcion } from "../formulario/CampoTextoAdopcion";

/** Paso 3 — Tu experiencia y por qué quieres adoptar. */
export const PasoExperienciaPostulacion = ({ datos, errores, onCambiar }: PasoPostulacionProps) => (
  <>
    <CampoTextoAdopcion
      id="postula-experiencia"
      etiqueta={T.experiencia}
      valor={datos.experiencia}
      onCambiar={(v) => onCambiar("experiencia", v)}
      placeholder={T.experienciaPlaceholder}
      multilinea
      maximo={MAX_TEXTO_POSTULACION}
    />
    <CampoTextoAdopcion
      id="postula-motivo"
      etiqueta={T.motivo}
      valor={datos.motivo}
      onCambiar={(v) => onCambiar("motivo", v)}
      placeholder={T.motivoPlaceholder}
      multilinea
      maximo={MAX_TEXTO_POSTULACION}
      error={errores.motivo}
    />
  </>
);
