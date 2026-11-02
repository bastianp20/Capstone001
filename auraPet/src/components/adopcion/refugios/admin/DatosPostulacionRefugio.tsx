import { Globe, MailCheck, MessageSquareText, UserRound, UserRoundCheck } from "lucide-react";
import { TEXTOS_POSTULACION_ADMIN as T } from "../../../../constants";
import type { DatosPostulacionRefugioProps } from "../../../../interfaces";

/** Lo que el refugio mandó al postular: fotos del lugar, responsable, sitio y mensaje. */
export const DatosPostulacionRefugio = ({ refugio: r }: DatosPostulacionRefugioProps) => {
  if (!r.fotosLugar.length && !r.responsable && !r.sitioWeb && !r.mensaje) return null;
  const pendiente = r.estado === "pendiente";
  const enlace = r.sitioWeb && (/^https?:\/\//i.test(r.sitioWeb) ? r.sitioWeb : `https://${r.sitioWeb}`);
  return (
    <section className="ra-detalle-bloque ra-postulacion">
      <h3>{T.titulo}</h3>
      {pendiente && (
        <p className={`ra-postulacion-cuenta ${r.correoAcceso ? "" : "ra-postulacion-cuenta-con"}`}>
          {r.correoAcceso ? <MailCheck size={16} aria-hidden /> : <UserRoundCheck size={16} aria-hidden />}
          {r.correoAcceso ? T.sinCuenta(r.correoAcceso) : T.conCuenta}
        </p>
      )}
      {r.fotosLugar.length > 0 && (
        <div className="ra-postulacion-fotos" aria-label={T.fotosLugar}>
          {r.fotosLugar.map((f, i) => (
            <a key={f} href={f} target="_blank" rel="noreferrer" aria-label={T.verFoto(i + 1)}>
              <img src={f} alt="" loading="lazy" />
            </a>
          ))}
        </div>
      )}
      <dl className="ra-postulacion-datos">
        {r.responsable && (
          <div>
            <dt>
              <UserRound size={14} aria-hidden /> {T.responsable}
            </dt>
            <dd>{r.responsable}</dd>
          </div>
        )}
        {enlace && (
          <div>
            <dt>
              <Globe size={14} aria-hidden /> {T.sitioWeb}
            </dt>
            <dd>
              <a href={enlace} target="_blank" rel="noreferrer">
                {r.sitioWeb}
              </a>
            </dd>
          </div>
        )}
        {r.mensaje && (
          <div className="ra-postulacion-mensaje">
            <dt>
              <MessageSquareText size={14} aria-hidden /> {T.mensaje}
            </dt>
            <dd>{r.mensaje}</dd>
          </div>
        )}
      </dl>
    </section>
  );
};
