import {
  COMUNAS_SUGERIDAS,
  OPCIONES_ESPECIE_PUBLICAR,
  OPCIONES_SEXO_ADOPCION,
  OPCIONES_TAMANO_ADOPCION,
  TEXTOS_PUBLICAR as T,
} from "../../../constants";
import type { EspecieMascota, PasoPublicarProps, TamanoAdopcion } from "../../../interfaces";
import { GrupoOpcionesAdopcion } from "../GrupoOpcionesAdopcion";
import { CampoSelectAdopcion } from "../formulario/CampoSelectAdopcion";
import { CampoTextoAdopcion } from "../formulario/CampoTextoAdopcion";
import { InterruptorAdopcion } from "../formulario/InterruptorAdopcion";
import { ZonaFotosAdopcion } from "../formulario/ZonaFotosAdopcion";

const COMUNAS = COMUNAS_SUGERIDAS.map((c) => ({ valor: c, label: c }));

/** Paso 1 — fotos, nombre, especie, sexo, edad, tamaño, comuna y pedir revisión. */
export const PasoDatosBasicosPublicar = ({ datos, errores, onCambiar }: PasoPublicarProps) => (
  <>
    <ZonaFotosAdopcion fotos={datos.fotos} onCambiar={(fotos) => onCambiar("fotos", fotos)} error={errores.fotos} />
    <CampoTextoAdopcion
      id="publica-nombre"
      etiqueta={T.nombre}
      valor={datos.nombre}
      onCambiar={(v) => onCambiar("nombre", v)}
      placeholder={T.nombrePlaceholder}
      maximo={40}
      error={errores.nombre}
    />
    <CampoSelectAdopcion
      id="publica-especie"
      etiqueta={T.especie}
      valor={datos.especie ?? ""}
      opciones={OPCIONES_ESPECIE_PUBLICAR}
      placeholder={T.elegir}
      onCambiar={(v) => onCambiar("especie", (v || null) as EspecieMascota | null)}
      error={errores.especie}
    />
    <div className="adopta-campo">
      <GrupoOpcionesAdopcion titulo={T.sexo} opciones={OPCIONES_SEXO_ADOPCION} valor={datos.sexo} onElegir={(v) => onCambiar("sexo", v)} />
      {errores.sexo && <p className="adopta-campo-error">{errores.sexo}</p>}
    </div>
    <fieldset className="adopta-campo">
      <legend>{T.edad}</legend>
      <div className="publica-fila-doble publica-edad">
        <CampoTextoAdopcion id="publica-anios" etiqueta={T.anios} tipo="number" valor={datos.anios} onCambiar={(v) => onCambiar("anios", v)} placeholder="Ej: 2" />
        <CampoTextoAdopcion id="publica-meses" etiqueta={T.meses} tipo="number" valor={datos.meses} onCambiar={(v) => onCambiar("meses", v)} placeholder="Ej: 5" />
      </div>
      {errores.anios && <p className="adopta-campo-error">{errores.anios}</p>}
    </fieldset>
    <CampoSelectAdopcion
      id="publica-tamano"
      etiqueta={T.tamano}
      valor={datos.tamano ?? ""}
      opciones={OPCIONES_TAMANO_ADOPCION}
      placeholder={T.elegir}
      onCambiar={(v) => onCambiar("tamano", (v || null) as TamanoAdopcion | null)}
      error={errores.tamano}
    />
    <CampoSelectAdopcion
      id="publica-comuna"
      etiqueta={T.comuna}
      valor={datos.comuna}
      opciones={COMUNAS}
      placeholder={T.elegir}
      onCambiar={(v) => onCambiar("comuna", v)}
      error={errores.comuna}
    />
    <div className="publica-revision">
      <InterruptorAdopcion etiqueta={T.revision} activo={datos.solicitaChequeo} onCambiar={(v) => onCambiar("solicitaChequeo", v)} />
    </div>
  </>
);
