import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PASOS_POSTULACION_ADOPCION, RUTA_ADOPTA, TEXTOS_POSTULACION as T } from "../../../constants";
import { usePostulacionAdopcion } from "../../../hooks/usePostulacionAdopcion";
import { useTeclaEscape } from "../../../hooks/useTeclaEscape";
import type { ModalPostulacionAdopcionProps } from "../../../interfaces";
import { IndicadorPasosAdopcion } from "../formulario/IndicadorPasosAdopcion";
import { PasoConfirmacionPostulacion } from "./PasoConfirmacionPostulacion";
import { PasoExperienciaPostulacion } from "./PasoExperienciaPostulacion";
import { PasoFamiliaPostulacion } from "./PasoFamiliaPostulacion";
import { PasoHogarPostulacion } from "./PasoHogarPostulacion";
import { PostulacionEnviadaAdopcion } from "./PostulacionEnviadaAdopcion";

const TITULOS_PASOS = PASOS_POSTULACION_ADOPCION.map((p) => p.titulo);

/** Modal "Quiero adoptar a…": 4 pasos y, al final, "¡Postulación enviada!". */
export const ModalPostulacionAdopcion = ({ adopcionId, nombreAnimal, publicador, onCerrar, onEnviada }: ModalPostulacionAdopcionProps) => {
  const navigate = useNavigate();
  const f = usePostulacionAdopcion(adopcionId, onEnviada);
  useTeclaEscape(onCerrar, !f.enviando);

  const paso = { datos: f.datos, errores: f.errores, onCambiar: f.actualizar };

  return (
    <div className="adopta adopta-modal-fondo" onClick={onCerrar}>
      <div className="adopta-modal" role="dialog" aria-modal="true" aria-label={T.titulo(nombreAnimal)} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="adopta-icono-btn adopta-modal-cerrar" onClick={onCerrar} aria-label={T.cerrar}>
          <X size={18} />
        </button>

        {f.enviada ? (
          <PostulacionEnviadaAdopcion publicador={publicador} onVerMas={() => navigate(RUTA_ADOPTA)} />
        ) : (
          <>
            <header className="postula-cabecera">
              <h2>{T.titulo(nombreAnimal)}</h2>
              <IndicadorPasosAdopcion pasos={TITULOS_PASOS} actual={f.paso} />
            </header>

            <div className="postula-cuerpo">
              {f.paso === 0 && <PasoHogarPostulacion {...paso} />}
              {f.paso === 1 && <PasoFamiliaPostulacion {...paso} />}
              {f.paso === 2 && <PasoExperienciaPostulacion {...paso} />}
              {f.paso === 3 && <PasoConfirmacionPostulacion {...paso} nombreAnimal={nombreAnimal} />}
              {f.errorEnvio && <p className="adopta-campo-error" role="alert">{f.errorEnvio}</p>}
            </div>

            <footer className="postula-pie">
              <button type="button" className="adopta-btn adopta-btn-borde" onClick={f.esPrimero ? onCerrar : f.retroceder} disabled={f.enviando}>
                {f.esPrimero ? T.cerrar : T.atras}
              </button>
              {f.esUltimo ? (
                <button type="button" className="adopta-btn adopta-btn-primario" onClick={f.enviar} disabled={f.enviando}>
                  {f.enviando ? T.enviando : T.enviar}
                </button>
              ) : (
                <button type="button" className="adopta-btn adopta-btn-primario" onClick={f.avanzar}>
                  {T.continuar}
                </button>
              )}
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
