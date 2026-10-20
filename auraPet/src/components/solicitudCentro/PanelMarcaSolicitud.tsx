import { BENEFICIOS_SOLICITUD, Iconos, PROCESO_SOLICITUD, TEXTOS_SOLICITUD } from "../../constants";
import type { PanelMarcaSolicitudProps } from "../../interfaces";

// Panel izquierdo (fijo en escritorio): foto con degradado de la marca,
// titular, beneficios y los 3 pasos del proceso. En celular se compacta.
export const PanelMarcaSolicitud = ({ imagen, onVolverInicio }: PanelMarcaSolicitudProps) => (
  <aside className="solicitud-marca" style={{ backgroundImage: `url(${imagen})` }}>
    <div className="solicitud-marca-overlay" aria-hidden="true" />
    <div className="solicitud-marca-contenido">
      <button type="button" className="solicitud-volver" onClick={onVolverInicio}>
        <Iconos.anterior size={16} /> {TEXTOS_SOLICITUD.volver}
      </button>

      <div className="solicitud-marca-hero">
        <span className="solicitud-eyebrow">{TEXTOS_SOLICITUD.eyebrow}</span>
        <h1 className="solicitud-titular">{TEXTOS_SOLICITUD.titular}</h1>
        <p className="solicitud-bajada">{TEXTOS_SOLICITUD.bajada}</p>
      </div>

      <ul className="solicitud-beneficios">
        {BENEFICIOS_SOLICITUD.map(({ icono: Icono, titulo, detalle }) => (
          <li key={titulo} className="solicitud-beneficio">
            <span className="solicitud-beneficio-icono"><Icono size={20} aria-hidden="true" /></span>
            <span>
              <strong>{titulo}</strong>
              {detalle && <small>{detalle}</small>}
            </span>
          </li>
        ))}
      </ul>

      <div className="solicitud-proceso">
        <h2 className="solicitud-proceso-titulo">{TEXTOS_SOLICITUD.tituloProceso}</h2>
        <ol className="solicitud-proceso-lista">
          {PROCESO_SOLICITUD.map(({ icono: Icono, titulo, detalle }) => (
            <li key={titulo} className="solicitud-proceso-paso">
              <span className="solicitud-proceso-icono"><Icono size={16} aria-hidden="true" /></span>
              <span>
                <strong>{titulo}</strong>
                {detalle && <small>{detalle}</small>}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </aside>
);
