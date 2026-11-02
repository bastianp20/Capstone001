import { BUCKET_AVATARES, MAX_MB_FOTO_ORIGINAL, TEXTOS_FOTO_PERFIL as T, TIPOS_FOTO_ADOPCION } from "../constants";
import { supabase } from "./supabase";

/** Ruta guardada en perfiles.avatar_url → URL pública (o null). */
export const urlFotoPerfil = (ruta: string | null): string | null => {
  if (!ruta) return null;
  if (/^https?:\/\//.test(ruta)) return ruta;
  return supabase.storage.from(BUCKET_AVATARES).getPublicUrl(ruta).data.publicUrl;
};

/** ¿Sirve este archivo como foto de perfil? Devuelve el error o null. */
export const errorFotoPerfil = (archivo: File): string | null => {
  if (!TIPOS_FOTO_ADOPCION.includes(archivo.type)) return T.errorTipo;
  if (archivo.size > MAX_MB_FOTO_ORIGINAL * 1024 * 1024) return T.errorPeso;
  return null;
};
