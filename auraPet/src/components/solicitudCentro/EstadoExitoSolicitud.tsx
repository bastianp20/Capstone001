import { Iconos, PROCESO_SOLICITUD, TEXTOS_SOLICITUD } from "../../constants";
import type { EstadoExitoSolicitudProps } from "../../interfaces";

// Reemplaza al formulario cuando la solicitud se envió bien
export const EstadoExitoSolicitud = ({ correo, onVolverInicio }: EstadoExitoSolicitudProps) => (
  <div className="solicitud-exito" role="status">
    <span className="solicitud-exito-icono"><Iconos.check size={36} aria-hidden="true" /></span>
    <h2 className="solicitud-exito-titulo">{TEXTOS_SOLICITUD.exitoTitulo}</h2>
    <p className="solicitud-exito-texto">
      Te escribiremos a <strong>{correo}</strong> en 1 a 3 días hábiles.
    </p>

    <div className="solicitud-exito-pasos">
      <h3>{TEXTOS_SOLICITUD.exitoQueSigue}</h3>
      <ol>
        {PROCESO_SOLICITUD.map(({ titulo, detalle }, i) => (
          <li key={titulo} className={i === 0 ? "solicitud-exito-paso--hecho" : undefined}>
            <span className="solicitud-exito-marca">{i === 0 ? <Iconos.check size={12} aria-hidden="true" /> : i + 1}</span>
            <span><strong>{titulo}</strong>{detalle && <small>{detalle}</small>}</span>
          </li>
        ))}
      </ol>
    </div>

    <button type="button" className="solicitud-btn solicitud-btn--primario" onClick={onVolverInicio}>
      {TEXTOS_SOLICITUD.volver}
    </button>
  </div>
);
