import { Iconos, TEXTOS_URGENCIAS as T } from "../../constants";
import { textoHorario } from "../../lib/centroAdmin";
import { telefonoParaMostrar } from "../../lib/refugios";
import { enlaceComoLlegar, enlaceLlamar, horarioDeHoy } from "../../lib/urgencias";
import type { TarjetaCentroUrgenciaProps } from "../../interfaces";
import { EtiquetaEstadoUci } from "./EtiquetaEstadoUci";

// Un centro en /urgencias: si está abierto, 24/7, su UCI y los botones grandes
// para llamar y llegar.
export const TarjetaCentroUrgencia = ({ centro: c, ahora }: TarjetaCentroUrgenciaProps) => {
  const hoy = horarioDeHoy(c.horarios, ahora);
  const textoHoy = c.horarios.length === 0 ? T.sinHorario : hoy ? T.hoy(textoHorario(hoy)) : T.hoyCerrado;

  return (
    <article className={`urg-tarjeta ${c.abiertoAhora ? "" : "urg-tarjeta-cerrada"}`}>
      <div>
        <h3>{c.nombre}</h3>
        <p className="urg-direccion">{c.direccion}, {c.comuna}</p>
      </div>

      <div className="urg-etiquetas">
        <span className={`urg-etiqueta ${c.abiertoAhora ? "urg-abierto" : "urg-cerrado"}`}>
          {c.abiertoAhora ? T.abiertoAhora : T.cerradoAhora}
        </span>
        {c.urgencias247 && <span className="urg-etiqueta urg-24">{T.urgencias247}</span>}
        {c.tieneUci && c.estadoUci && <EtiquetaEstadoUci estado={c.estadoUci} ahora={ahora} />}
      </div>

      {!c.urgencias247 && <p className="urg-hoy">{textoHoy}</p>}

      <div className="urg-acciones">
        {c.telefono ? (
          <a className="urg-boton" href={enlaceLlamar(c.telefono)} aria-label={`${T.llamar} a ${c.nombre}, ${telefonoParaMostrar(c.telefono)}`}>
            <Iconos.telefono size={18} aria-hidden="true" /> {T.llamar}
          </a>
        ) : (
          <span className="urg-sin-telefono">{T.sinTelefono}</span>
        )}
        <a className="urg-boton-secundario" href={enlaceComoLlegar(c.direccion, c.comuna)} target="_blank" rel="noopener noreferrer">
          <Iconos.ubicacion size={18} aria-hidden="true" /> {T.comoLlegar}
        </a>
      </div>
    </article>
  );
};
