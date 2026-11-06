import {
  ETIQUETAS_RASGOS_ADOPCION,
  MAX_PERSONALIDAD_ADOPCION,
  OPCIONES_PERSONALIDAD_ADOPCION,
  RASGOS_ADOPCION,
  TEXTOS_PUBLICAR as T,
} from "../../../constants";
import type { PasoPublicarProps } from "../../../interfaces";
import { CampoTextoAdopcion } from "../formulario/CampoTextoAdopcion";
import { SelectorEtiquetasAdopcion } from "../formulario/SelectorEtiquetasAdopcion";
import { SelectorNivelAdopcion } from "../formulario/SelectorNivelAdopcion";

/** Paso 2 — etiquetas de personalidad, rasgos de 1 a 5 y una frase. */
export const PasoPersonalidadPublicar = ({ datos, errores, onCambiar }: PasoPublicarProps) => (
  <>
    <div className="adopta-campo">
      <span className="adopta-campo-titulo">{T.personalidad}</span>
      <SelectorEtiquetasAdopcion
        opciones={OPCIONES_PERSONALIDAD_ADOPCION}
        elegidas={datos.personalidad}
        maximo={MAX_PERSONALIDAD_ADOPCION}
        onCambiar={(v) => onCambiar("personalidad", v)}
        error={errores.personalidad}
      />
    </div>
    <div className="adopta-campo">
      <span className="adopta-campo-titulo">{T.rasgos}</span>
      <div className="publica-rasgos">
        {RASGOS_ADOPCION.map((r) => (
          <SelectorNivelAdopcion
            key={r}
            etiqueta={ETIQUETAS_RASGOS_ADOPCION[r]}
            valor={datos.rasgos[r]}
            onCambiar={(v) => onCambiar("rasgos", { ...datos.rasgos, [r]: v })}
          />
        ))}
      </div>
    </div>
    <CampoTextoAdopcion
      id="publica-frase"
      etiqueta={T.frase}
      valor={datos.frase}
      onCambiar={(v) => onCambiar("frase", v)}
      placeholder={T.frasePlaceholder}
      maximo={160}
    />
  </>
);
