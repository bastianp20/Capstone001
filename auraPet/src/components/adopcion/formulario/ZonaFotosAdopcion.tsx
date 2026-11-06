import { ImagePlus, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { MAX_FOTOS_ADOPCION, TEXTOS_PUBLICAR as T, TIPOS_FOTO_ADOPCION } from "../../../constants";
import { useFotosAdopcion } from "../../../hooks/useFotosAdopcion";
import type { ZonaFotosAdopcionProps } from "../../../interfaces";

/** Zona para arrastrar o elegir hasta 6 fotos, con vistas previas. La primera es la principal. */
export const ZonaFotosAdopcion = ({ fotos, onCambiar, error }: ZonaFotosAdopcionProps) => {
  const { agregar, quitar, error: errorFoto } = useFotosAdopcion(fotos, onCambiar);
  const input = useRef<HTMLInputElement>(null);
  const [encima, setEncima] = useState(false);

  const soltar = (e: DragEvent) => {
    e.preventDefault();
    setEncima(false);
    agregar(e.dataTransfer.files);
  };
  const huecos = Math.max(0, MAX_FOTOS_ADOPCION - fotos.length);
  const mensaje = errorFoto ?? error;

  return (
    <div className="adopta-campo">
      <div
        className={`adopta-fotos ${encima ? "adopta-fotos-encima" : ""} ${mensaje ? "adopta-fotos-error" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={soltar}
      >
        <p className="adopta-fotos-titulo">{T.fotos(fotos.length)}</p>
        <div className="adopta-fotos-grilla">
          {fotos.map((f, i) => (
            <figure key={f.id} className="adopta-foto">
              <img src={f.vista} alt="" />
              {i === 0 && <span className="adopta-foto-principal">{T.fotoPrincipal}</span>}
              <button type="button" className="adopta-foto-quitar" onClick={() => quitar(f.id)} aria-label={T.quitarFoto}>
                <X size={14} />
              </button>
            </figure>
          ))}
          {Array.from({ length: huecos }, (_, i) => (
            <button key={i} type="button" className="adopta-foto-hueco" onClick={() => input.current?.click()} aria-label={T.fotos(fotos.length)}>
              {i === 0 && <ImagePlus size={22} aria-hidden />}
            </button>
          ))}
        </div>
        <input
          ref={input}
          type="file"
          accept={TIPOS_FOTO_ADOPCION.join(",")}
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) agregar(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {mensaje && <p className="adopta-campo-error">{mensaje}</p>}
    </div>
  );
};
