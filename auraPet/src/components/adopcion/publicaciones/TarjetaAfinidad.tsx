import { AlertCircle, CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { TEXTOS_ELEGIR_FAMILIA as T } from "../../../constants";
import type { TarjetaAfinidadProps } from "../../../interfaces";
import { telefonoParaWhatsapp } from "../../../lib/publicacionesAdopcion";

/** "¿Por qué hacen match?": razones a favor, cosas para conversar y el contacto. */
export const TarjetaAfinidad = ({ nombreAnimal, afinidad, postulacion: p }: TarjetaAfinidadProps) => {
  const whatsapp = p.telefono ? telefonoParaWhatsapp(p.telefono) : null;
  return (
    <aside className="ap-tarjeta ap-afinidad">
      <h2>{T.match}</h2>
      <ul>
        {afinidad.razones.map((r) => (
          <li key={r.texto} className={`ap-razon ap-razon-${r.tipo}`}>
            {r.tipo === "ok" ? <CheckCircle2 size={16} aria-hidden /> : <AlertCircle size={16} aria-hidden />}
            <span>{r.texto}</span>
          </li>
        ))}
      </ul>
      <p className="ap-suave ap-afinidad-guia">{T.guia}</p>
      <div className="ap-contacto">
        <h3>{T.contacto}</h3>
        <p>{p.correo}</p>
        {p.telefono && <p>+{p.telefono}</p>}
        <div className="ap-contacto-botones">
          <a
            className="ap-btn ap-btn-borde ap-btn-chico"
            href={`mailto:${p.correo}?subject=${encodeURIComponent(T.correoAsunto(nombreAnimal))}`}
          >
            <Mail size={15} aria-hidden /> {T.escribirCorreo}
          </a>
          {whatsapp && (
            <a
              className="ap-btn ap-btn-borde ap-btn-chico"
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(T.whatsappTexto(nombreAnimal))}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={15} aria-hidden /> {T.whatsapp}
            </a>
          )}
        </div>
      </div>
    </aside>
  );
};
