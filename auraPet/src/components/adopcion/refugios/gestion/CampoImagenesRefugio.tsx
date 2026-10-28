import { Camera, ImagePlus } from "lucide-react";
import { useRef, type DragEvent } from "react";
import { TEXTOS_MODAL_REFUGIO as T, TIPOS_FOTO_ADOPCION } from "../../../../constants";
import type { CampoImagenesRefugioProps } from "../../../../interfaces";
import { LogoRefugio } from "./LogoRefugio";

/** Portada ancha (arrastrar o hacer clic) con el logo circular encima. */
export const CampoImagenesRefugio = ({ nombre, logo, portada, onLogo, onPortada, error }: CampoImagenesRefugioProps) => {
  const inputPortada = useRef<HTMLInputElement>(null);
  const inputLogo = useRef<HTMLInputElement>(null);
  const soltar = (e: DragEvent) => {
    e.preventDefault();
    const archivo = e.dataTransfer.files[0];
    if (archivo) onPortada(archivo);
  };
  const tipos = TIPOS_FOTO_ADOPCION.join(",");
  return (
    <div className="ap-imagenes-refugio">
      <button
        type="button"
        className={`ap-portada-campo ${portada.vista ? "ap-portada-campo-llena" : ""}`}
        onClick={() => inputPortada.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={soltar}
      >
        {portada.vista ? <img src={portada.vista} alt="" /> : null}
        <span className="ap-portada-campo-texto">
          <ImagePlus size={22} aria-hidden /> {portada.vista ? T.cambiarPortada : T.portada}
        </span>
      </button>
      <button type="button" className="ap-logo-campo" onClick={() => inputLogo.current?.click()} aria-label={T.logo}>
        <LogoRefugio nombre={nombre} logoUrl={logo.vista} tamano="grande" />
        <span className="ap-logo-campo-camara" aria-hidden>
          <Camera size={14} />
        </span>
      </button>
      <input ref={inputPortada} type="file" accept={tipos} hidden onChange={(e) => e.target.files?.[0] && onPortada(e.target.files[0])} />
      <input ref={inputLogo} type="file" accept={tipos} hidden onChange={(e) => e.target.files?.[0] && onLogo(e.target.files[0])} />
      {error && <p className="adopta-campo-error" role="alert">{error}</p>}
    </div>
  );
};
