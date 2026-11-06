import { Iconos, TEXTOS_URGENCIAS as T } from "../../constants";
import { telefonoParaMostrar } from "../../lib/refugios";
import { enlaceLlamar } from "../../lib/urgencias";
import type { TarjetaVetUrgenciaProps } from "../../interfaces";

// Un veterinario con urgencias 24/7 que aceptó mostrar su teléfono.
export const TarjetaVetUrgencia = ({ veterinario: v }: TarjetaVetUrgenciaProps) => {
  const zona = [v.aDomicilio ? T.aDomicilio : null, ...v.comunas].filter(Boolean).join(" · ");
  return (
    <article className="urg-tarjeta">
      <div className="urg-vet">
        {v.avatarUrl
          ? <img className="urg-avatar" src={v.avatarUrl} alt="" />
          : <span className="urg-avatar" aria-hidden="true">{v.nombre.charAt(0).toUpperCase()}</span>}
        <div>
          <h3>{v.nombre}</h3>
          {zona && <p className="urg-direccion">{zona}</p>}
        </div>
      </div>
      <div className="urg-etiquetas">
        <span className="urg-etiqueta urg-24">{T.urgencias247}</span>
      </div>
      <a className="urg-boton" href={enlaceLlamar(v.telefono)} aria-label={`${T.llamar} a ${v.nombre}, ${telefonoParaMostrar(v.telefono)}`}>
        <Iconos.telefono size={18} aria-hidden="true" /> {T.llamar} · {telefonoParaMostrar(v.telefono)}
      </a>
    </article>
  );
};
