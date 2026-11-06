import { Camera, Trash2 } from "lucide-react";
import { useRef } from "react";
import { FORMATO_RECORTE_LOGO, TEXTOS_FOTO_PERFIL as T, TIPOS_FOTO_ADOPCION } from "../../constants";
import { useFotoPerfil } from "../../hooks/useFotoPerfil";
import type { CampoFotoPerfilProps } from "../../interfaces";
import { ModalRecorteImagen } from "../ui/ModalRecorteImagen";
import { FotoPerfil } from "./FotoPerfil";

/** "Editar perfil": subir, cambiar o quitar la foto (opcional). */
export const CampoFotoPerfil = ({ nombre }: CampoFotoPerfilProps) => {
  const f = useFotoPerfil();
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="campo-foto-perfil">
      <FotoPerfil nombre={nombre} url={f.url} className="campo-foto-perfil-circulo" />
      <div className="campo-foto-perfil-texto">
        <strong>{T.titulo}</strong>
        <small>{T.opcional}</small>
        <div className="campo-foto-perfil-botones">
          <button type="button" className="campo-foto-perfil-btn" onClick={() => input.current?.click()} disabled={f.ocupado}>
            <Camera size={15} aria-hidden /> {f.ocupado ? T.subiendo : f.url ? T.cambiar : T.subir}
          </button>
          {f.url && (
            <button type="button" className="campo-foto-perfil-btn campo-foto-perfil-quitar" onClick={f.quitar} disabled={f.ocupado}>
              <Trash2 size={15} aria-hidden /> {T.quitar}
            </button>
          )}
        </div>
        {f.error && <p className="campo-foto-perfil-error" role="alert">{f.error}</p>}
      </div>
      <input
        ref={input}
        type="file"
        accept={TIPOS_FOTO_ADOPCION.join(",")}
        hidden
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          if (archivo) f.elegir(archivo);
          e.target.value = "";
        }}
      />
      {f.porRecortar && (
        <ModalRecorteImagen url={f.porRecortar} formato={FORMATO_RECORTE_LOGO} titulo={T.ajustar} onListo={f.recortada} onCancelar={f.cancelarRecorte} />
      )}
    </div>
  );
};
