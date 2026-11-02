import type { FotoPerfilProps } from "../../interfaces";
import { getIniciales } from "../../utils";
import "../../css/FotoPerfil.css";

/** Círculo con la foto de perfil, o las iniciales si no tiene. */
export const FotoPerfil = ({ nombre, url, className = "" }: FotoPerfilProps) => (
  <span className={`foto-perfil ${className}`} aria-hidden>
    {url ? <img src={url} alt="" /> : getIniciales(nombre)}
  </span>
);
