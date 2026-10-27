import { OPCIONES_TENENCIA_ADOPCION, OPCIONES_VIVIENDA_ADOPCION, TEXTOS_POSTULACION as T } from "../../../constants";
import type { PasoPostulacionProps } from "../../../interfaces";
import { GrupoOpcionesAdopcion } from "../GrupoOpcionesAdopcion";
import { CampoSiNoAdopcion } from "../formulario/CampoSiNoAdopcion";

/** Paso 1 — Tu hogar: tipo de vivienda, patio y si es propia o arrendada. */
export const PasoHogarPostulacion = ({ datos, errores, onCambiar }: PasoPostulacionProps) => (
  <>
    <div className="adopta-campo">
      <GrupoOpcionesAdopcion titulo={T.vivienda} opciones={OPCIONES_VIVIENDA_ADOPCION} valor={datos.vivienda} onElegir={(v) => v && onCambiar("vivienda", v)} />
      {errores.vivienda && <p className="adopta-campo-error">{errores.vivienda}</p>}
    </div>
    <CampoSiNoAdopcion etiqueta={T.patio} valor={datos.tienePatio} onCambiar={(v) => onCambiar("tienePatio", v)} error={errores.tienePatio} />
    <div className="adopta-campo">
      <GrupoOpcionesAdopcion titulo={T.tenencia} opciones={OPCIONES_TENENCIA_ADOPCION} valor={datos.tenencia} onElegir={(v) => v && onCambiar("tenencia", v)} />
      {errores.tenencia && <p className="adopta-campo-error">{errores.tenencia}</p>}
    </div>
    {datos.tenencia === "arrendada" && (
      <CampoSiNoAdopcion
        etiqueta={T.permitenMascotas}
        valor={datos.permitenMascotas}
        onCambiar={(v) => onCambiar("permitenMascotas", v)}
        error={errores.permitenMascotas}
      />
    )}
  </>
);
