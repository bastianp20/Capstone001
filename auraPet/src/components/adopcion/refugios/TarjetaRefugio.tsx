import { Mail, MapPin, PawPrint, Phone, Stethoscope } from "lucide-react";
import { COLOR_RECEPCION_REFUGIO, RECEPCION_REFUGIO_LABEL, TEXTOS_REFUGIOS as T } from "../../../constants";
import type { TarjetaRefugioProps } from "../../../interfaces";
import { iniciales, ocupacionRefugio, telefonoParaWhatsapp } from "../../../lib/publicacionesAdopcion";
import { AnilloProgreso } from "../comun/AnilloProgreso";

/** Tarjeta de un refugio: portada, logo, cupos en anillo, sus animales y sus aliados. */
export const TarjetaRefugio = ({ refugio: r, onVerAnimales }: TarjetaRefugioProps) => {
  const contacto = r.correo ? `mailto:${r.correo}` : r.telefono ? `https://wa.me/${telefonoParaWhatsapp(r.telefono)}` : null;
  return (
    <article className="ap-refugio">
      <div className="ap-refugio-portada">
        {r.portadaUrl ? <img src={r.portadaUrl} alt="" loading="lazy" /> : <span className="ap-refugio-portada-vacia" aria-hidden><PawPrint size={40} /></span>}
        <span className="ap-refugio-logo">{r.logoUrl ? <img src={r.logoUrl} alt="" /> : iniciales(r.nombre)}</span>
      </div>
      <div className="ap-refugio-cuerpo">
        <div className="ap-refugio-cabecera">
          <div>
            <h3>{r.nombre}</h3>
            <p className="ap-suave">
              <MapPin size={13} aria-hidden /> {r.comuna} · {r.region}
            </p>
            <span className={`ap-chip ap-chip-recibe-${r.recibe}`}>{RECEPCION_REFUGIO_LABEL[r.recibe]}</span>
          </div>
          {r.cuposTotales > 0 && (
            <div className="ap-refugio-cupos">
              <AnilloProgreso porcentaje={ocupacionRefugio(r)} tamano={64} grosor={6} etiqueta={`${r.cuposOcupados}/${r.cuposTotales}`} color={COLOR_RECEPCION_REFUGIO[r.recibe]} />
              <small className="ap-suave">cupos</small>
            </div>
          )}
        </div>
        <div className="ap-refugio-animales">
          <span className="ap-fotos-apiladas" aria-hidden>
            {r.fotos.slice(0, 4).map((f) => (
              <img key={f} src={f} alt="" loading="lazy" />
            ))}
          </span>
          <strong>{T.esperando(r.enAdopcion)}</strong>
        </div>
        {r.aliados > 0 && (
          <p className="ap-sello">
            <Stethoscope size={13} aria-hidden /> {T.atendidosPor(r.aliados)}
          </p>
        )}
        <div className="ap-refugio-acciones">
          <button type="button" className="ap-btn ap-btn-primario ap-btn-chico" onClick={() => onVerAnimales(r)} disabled={!r.enAdopcion}>
            {T.verAnimales}
          </button>
          {contacto && (
            <a className="ap-btn ap-btn-borde ap-btn-chico" href={contacto} target={r.correo ? undefined : "_blank"} rel="noreferrer">
              {r.correo ? <Mail size={14} aria-hidden /> : <Phone size={14} aria-hidden />} {T.contactar}
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
