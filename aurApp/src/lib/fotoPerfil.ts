import { BUCKET_AVATARES } from '@/constants/constants';

import { supabase } from './supabase';

// Fotos de perfil (bucket "avatares", migración 44). Sin estado.

/** Ruta guardada en perfiles.avatar_url → URL pública (o null). Si ya es una URL, queda igual. */
export const urlFotoPerfil = (ruta: string | null): string | null => {
  if (!ruta) return null;
  if (/^https?:\/\//.test(ruta)) return ruta;
  return supabase.storage.from(BUCKET_AVATARES).getPublicUrl(ruta).data.publicUrl;
};
