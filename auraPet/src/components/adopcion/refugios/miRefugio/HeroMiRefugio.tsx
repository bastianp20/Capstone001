import { ArrowUpRight, BadgeCheck, MapPin, PawPrint } from "lucide-react";
import { ESTADO_REFUGIO_LABEL, TEXTOS_MI_REFUGIO as T } from "../../../../constants";
import type { HeroMiRefugioProps } from "../../../../interfaces";
import { LogoRefugio } from "../gestion/LogoRefugio";

/** Portada grande con el logo, el nombre y el acceso a la página pública. */
export const HeroMiRefugio = ({ refugio: r, onVerPublica }: HeroMiRefugioProps) => (
  <header className="mr-hero">
    {r.portadaUrl ? <img className="mr-hero-foto" src={r.portadaUrl} alt="" /> : <span className="mr-hero-vacia" aria-hidden><PawPrint size={64} /></span>}
    <div className="mr-hero-contenido">
      <div className="mr-hero-identidad">
        <LogoRefugio nombre={r.nombre} logoUrl={r.logoUrl} tamano="grande" />
        <div>
          <h1>{r.nombre}</h1>
          <p>
            <MapPin size={14} aria-hidden /> {r.comuna} · {r.region}
          </p>
          <span className={`mr-hero-chip mr-hero-chip-${r.estado}`}>
            {r.estado === "aprobado" && <BadgeCheck size={14} aria-hidden />} {ESTADO_REFUGIO_LABEL[r.estado]}
          </span>
        </div>
      </div>
      {r.estado === "aprobado" && (
        <button type="button" className="ap-btn ap-btn-vidrio" onClick={onVerPublica}>
          {T.verPublica} <ArrowUpRight size={16} aria-hidden />
        </button>
      )}
    </div>
  </header>
);
