import { OPCIONES_TENENCIA_ADOPCION, OPCIONES_VIVIENDA_ADOPCION, TEXTOS_POSTULACION as T } from "../../../constants";
import type { PasoConfirmacionPostulacionProps } from "../../../interfaces";

const siNo = (v: boolean | null) => (v ? T.si : T.no);
const label = <V extends string>(opciones: readonly { valor: V; label: string }[], v: V | null) =>
  opciones.find((o) => o.valor === v)?.label ?? "—";

/** Paso 4 — Resumen de lo que se envía y el compromiso. */
export const PasoConfirmacionPostulacion = ({ datos, errores, onCambiar, nombreAnimal }: PasoConfirmacionPostulacionProps) => (
  <>
    <h3 className="postula-resumen-titulo">{T.resumen}</h3>
    <dl className="postula-resumen">
      <dt>{T.vivienda}</dt>
      <dd>{label(OPCIONES_VIVIENDA_ADOPCION, datos.vivienda)} · {T.patio} {siNo(datos.tienePatio)}</dd>
      <dt>{T.tenencia}</dt>
      <dd>
        {label(OPCIONES_TENENCIA_ADOPCION, datos.tenencia)}
        {datos.tenencia === "arrendada" && ` · ${T.permitenMascotas} ${siNo(datos.permitenMascotas)}`}
      </dd>
      <dt>{T.hayNinos}</dt>
      <dd>{datos.hayNinos ? `${T.si} (${datos.edadesNinos})` : T.no}</dd>
      <dt>{T.otrasMascotas}</dt>
      <dd>{datos.otrasMascotas ? `${T.si} (${datos.cualesMascotas})` : T.no}</dd>
      <dt>{T.motivo}</dt>
      <dd>{datos.motivo}</dd>
    </dl>
    <label className="postula-compromiso">
      <input type="checkbox" checked={datos.aceptaCompromiso} onChange={(e) => onCambiar("aceptaCompromiso", e.target.checked)} />
      <span>{T.compromiso(nombreAnimal)}</span>
    </label>
    {errores.aceptaCompromiso && <p className="adopta-campo-error">{errores.aceptaCompromiso}</p>}
  </>
);
