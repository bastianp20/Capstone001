import { PASOS_PUBLICAR_ADOPCION, TEXTOS_PUBLICAR as T } from "../../../constants";
import { useMisRefugios } from "../../../hooks/useMisRefugios";
import { usePublicarAdopcion } from "../../../hooks/usePublicarAdopcion";
import type { FormularioPublicarAdopcionProps } from "../../../interfaces";
import { IndicadorPasosAdopcion } from "../formulario/IndicadorPasosAdopcion";
import { PasoDatosBasicosPublicar } from "./PasoDatosBasicosPublicar";
import { PasoPersonalidadPublicar } from "./PasoPersonalidadPublicar";
import { PasoRevisionPublicar } from "./PasoRevisionPublicar";
import { PasoSaludPublicar } from "./PasoSaludPublicar";
import { PublicacionListaAdopcion } from "./PublicacionListaAdopcion";

const TITULOS_PASOS = PASOS_PUBLICAR_ADOPCION.map((p) => p.titulo);

/**
 * "Dar en adopción" en 4 pasos (necesita sesión). Lo usan la página /adopta/publicar
 * y el modal que se abre desde el panel de cualquier rol.
 */
export const FormularioPublicarAdopcion = ({ onVerPublicacion, onPublicada, enModal = false, refugioId }: FormularioPublicarAdopcionProps) => {
  const f = usePublicarAdopcion(onPublicada, refugioId);
  const refugios = useMisRefugios();
  const paso = { datos: f.datos, errores: f.errores, onCambiar: f.actualizar };
  const clase = `publica-tarjeta ${enModal ? "publica-en-modal" : ""}`;

  if (f.publicadaId) {
    const id = f.publicadaId;
    return (
      <div className={clase}>
        <PublicacionListaAdopcion nombre={f.datos.nombre} onVer={() => onVerPublicacion(id)} onOtra={f.otraPublicacion} />
      </div>
    );
  }

  return (
    <form
      className={clase}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (f.esUltimo) f.publicar();
        else f.avanzar();
      }}
    >
      <IndicadorPasosAdopcion pasos={TITULOS_PASOS} actual={f.paso} />
      <h2>{T.paso(f.paso + 1, f.pasoActual.titulo)}</h2>

      <div className="publica-campos">
        {f.paso === 0 && <PasoDatosBasicosPublicar {...paso} refugios={refugios} />}
        {f.paso === 1 && <PasoPersonalidadPublicar {...paso} />}
        {f.paso === 2 && <PasoSaludPublicar {...paso} />}
        {f.paso === 3 && <PasoRevisionPublicar datos={f.datos} />}
      </div>
      {f.errorPublicar && <p className="adopta-campo-error" role="alert">{f.errorPublicar}</p>}

      <div className="publica-botones">
        {!f.esPrimero && (
          <button type="button" className="adopta-btn adopta-btn-borde" onClick={f.retroceder} disabled={f.publicando}>
            {T.atras}
          </button>
        )}
        <button type="submit" className="adopta-btn adopta-btn-primario publica-continuar" disabled={f.publicando}>
          {f.esUltimo ? (f.publicando ? T.publicando : T.publicar) : T.continuar}
        </button>
      </div>
    </form>
  );
};
