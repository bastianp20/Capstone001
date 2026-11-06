import { ShieldCheck } from "lucide-react";
import { TEXTOS_MODERACION as T } from "../../../constants";
import { useModeracion } from "../../../hooks/useModeracion";
import type { SeccionModeracionProps } from "../../../interfaces";
import { RechazarModal } from "../../../Modal/ReachazarModal";
import { DetalleCasoModeracion } from "./DetalleCasoModeracion";
import { EncabezadoModeracion } from "./EncabezadoModeracion";
import { FilaCasoModeracion } from "./FilaCasoModeracion";
import "../../../css/AdopcionPanel.css";
import "../../../css/Moderacion.css";

/** "Moderación" del superadmin: bandeja de publicaciones reportadas y su decisión. */
export const SeccionModeracion = ({ onCambio }: SeccionModeracionProps) => {
  const m = useModeracion(onCambio);
  const { caso, dialogo } = m;
  const ocultar = dialogo === "ocultar";

  return (
    <>
      <div className="ap mod">
        <EncabezadoModeracion
          resumen={m.resumen}
          estado={m.estado}
          onEstado={m.cambiarEstado}
        />
        {m.errorAccion && (
          <p className="adopta-campo-error" role="alert">
            {m.errorAccion}
          </p>
        )}

        {m.cargando ? (
          <p className="ap-estado">{T.cargando}</p>
        ) : m.error ? (
          <p className="ap-estado" role="alert">
            {T.error}
          </p>
        ) : m.casos.length === 0 ? (
          <div className="mod-vacio">
            <ShieldCheck size={40} aria-hidden />
            <p>{T.vacio[m.estado]}</p>
          </div>
        ) : (
          <div className="mod-bandeja">
            <nav className="mod-lista" aria-label={T.titulo}>
              {m.casos.map((c) => (
                <FilaCasoModeracion
                  key={c.adopcionId}
                  caso={c}
                  activo={c.adopcionId === caso?.adopcionId}
                  onElegir={m.elegir}
                />
              ))}
            </nav>
            {caso ? (
              <DetalleCasoModeracion
                caso={caso}
                ocupado={m.ocupado}
                onDecidir={m.decidir}
              />
            ) : (
              <p className="ap-estado">{T.elegir}</p>
            )}
          </div>
        )}
      </div>

      {dialogo && caso && (
        <RechazarModal
          nombreSolicitud={`${caso.nombre} · ${caso.publicador}`}
          titulo={ocultar ? T.tituloOcultar : T.tituloAdvertir}
          descripcion={ocultar ? T.descripcionOcultar : T.descripcionAdvertir}
          etiqueta={T.etiquetaMensaje}
          placeholder={T.placeholderMensaje}
          valorInicial={T.mensajeSugerido[caso.motivoPrincipal]}
          textoConfirmar={ocultar ? T.confirmarOcultar : T.confirmarAdvertir}
          textoProcesando={T.procesando}
          ocupado={m.ocupado}
          onCancelar={m.cerrarDialogo}
          onConfirmar={(mensaje) => m.resolver(dialogo, mensaje)}
        />
      )}
    </>
  );
};
