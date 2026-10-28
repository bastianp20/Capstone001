import { ArrowRight, Check, X } from "lucide-react";
import { useId } from "react";
import { PASOS_REFUGIO, TEXTOS_MODAL_REFUGIO as T } from "../../../../constants";
import { useFormularioRefugio } from "../../../../hooks/useFormularioRefugio";
import { useTeclaEscape } from "../../../../hooks/useTeclaEscape";
import type { ModalRefugioProps } from "../../../../interfaces";
import { StepperCirculos } from "../../comun/StepperCirculos";
import { PasoAdministradoresRefugio } from "./PasoAdministradoresRefugio";
import { PasoCapacidadRefugio } from "./PasoCapacidadRefugio";
import { PasoDatosRefugio } from "./PasoDatosRefugio";
import { VistaPreviaRefugio } from "./VistaPreviaRefugio";

const NOMBRES_PASOS = PASOS_REFUGIO.map((p) => p.titulo);

/** Modal "Nuevo / Editar refugio": 3 pasos y la tarjeta pública en vivo al lado. */
export const ModalRefugio = ({ refugio, onCerrar, onGuardado }: ModalRefugioProps) => {
  const idTitulo = useId();
  const f = useFormularioRefugio(refugio, onGuardado);
  useTeclaEscape(onCerrar, !f.ocupado);
  const comunes = { datos: f.datos, errores: f.errores, onCambiar: f.actualizar };

  return (
    <div className="ap ra-modal-fondo" onClick={() => !f.ocupado && onCerrar()}>
      <div className="ra-modal" role="dialog" aria-modal="true" aria-labelledby={idTitulo} onClick={(e) => e.stopPropagation()}>
        <header className="ra-modal-cabecera">
          <div>
            <h2 id={idTitulo}>{f.esNuevo ? T.nuevo : T.editar}</h2>
            <p className="ap-suave">{T.bajada}</p>
          </div>
          <button type="button" className="ap-icono-btn" onClick={onCerrar} aria-label={T.cancelar} disabled={f.ocupado}>
            <X size={18} />
          </button>
        </header>

        <StepperCirculos pasos={NOMBRES_PASOS} actual={f.paso} />

        <div className="ra-modal-cuerpo">
          <form className="ra-modal-form" onSubmit={(e) => e.preventDefault()} noValidate>
            {f.paso === 0 && (
              <PasoDatosRefugio {...comunes} onLogo={f.elegirLogo} onPortada={f.elegirPortada} errorImagen={f.errorImagen} />
            )}
            {f.paso === 1 && <PasoCapacidadRefugio {...comunes} />}
            {f.paso === 2 && <PasoAdministradoresRefugio datos={f.datos} errores={f.errores} onAgregar={f.agregarAdmin} onQuitar={f.quitarAdmin} />}
          </form>
          <VistaPreviaRefugio datos={f.datos} />
        </div>

        <footer className="ra-modal-pie">
          <span className="ap-suave">{T.pasoDe(f.paso + 1, NOMBRES_PASOS.length)}</span>
          {f.errorGuardar && (
            <p className="adopta-campo-error" role="alert">
              {f.errorGuardar}
            </p>
          )}
          <div className="ra-modal-botones">
            {f.esPrimero ? (
              <button type="button" className="ap-btn-texto" onClick={onCerrar}>
                {T.cancelar}
              </button>
            ) : (
              <button type="button" className="ap-btn ap-btn-borde" onClick={f.retroceder} disabled={f.ocupado}>
                {T.atras}
              </button>
            )}
            {f.esUltimo ? (
              <button type="button" className="ap-btn ap-btn-primario" onClick={f.guardar} disabled={f.ocupado}>
                {f.ocupado ? T.guardando : f.esNuevo ? T.crear : T.guardar} {!f.ocupado && <Check size={16} aria-hidden />}
              </button>
            ) : (
              <button type="button" className="ap-btn ap-btn-primario" onClick={f.avanzar}>
                {T.siguiente} <ArrowRight size={16} aria-hidden />
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};
