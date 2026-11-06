import type { LogoRefugioProps } from "../../../../interfaces";
import { iniciales } from "../../../../lib/publicacionesAdopcion";

/** Logo circular del refugio (o sus iniciales si no tiene). */
export const LogoRefugio = ({ nombre, logoUrl, tamano = "mediano" }: LogoRefugioProps) => (
  <span className={`ap-logo-refugio ap-logo-refugio-${tamano}`} aria-hidden>
    {logoUrl ? <img src={logoUrl} alt="" /> : iniciales(nombre) || "R"}
  </span>
);
