import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { RUTA_CONTACTO_REPORTE, TEXTOS_ADOPCION as T } from "../../constants";
import type { AvisoConfianzaAdopcionProps } from "../../interfaces";

/** La adopción es gratis y cómo reportar una publicación (al pie de /adopta o, compacto, en la ficha). */
export const AvisoConfianzaAdopcion = ({ compacto = false }: AvisoConfianzaAdopcionProps) => (
  <section className={compacto ? "adopta-confianza adopta-confianza-compacta" : "adopta-confianza"}>
    <ShieldCheck size={compacto ? 22 : 28} aria-hidden />
    <p>
      <strong>{T.confianzaTitulo}</strong> {T.confianzaTexto}
    </p>
    <Link to={RUTA_CONTACTO_REPORTE}>{T.reportar}</Link>
  </section>
);
