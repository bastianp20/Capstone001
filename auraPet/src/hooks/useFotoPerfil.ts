import { useCallback, useState } from "react";
import { guardarFotoPerfil, quitarFotoPerfil } from "../Api/postInfo";
import { useAuth } from "../Auth/AuthContext";
import { TEXTOS_FOTO_PERFIL as T } from "../constants";
import { errorFotoPerfil } from "../lib/fotoPerfil";
import { useAccion } from "./useAccion";
import { useVistasLocales } from "./useVistasLocales";

// Foto de perfil de la persona conectada: elegir → recortar → guardar, o quitarla.
// Al terminar se vuelve a leer el perfil, así la foto nueva se ve en toda la app.
export const useFotoPerfil = () => {
  const { usuarioActual, recargarPerfil } = useAuth();
  const crearVista = useVistasLocales();
  const { ejecutar, ocupado, error } = useAccion();
  const [porRecortar, setPorRecortar] = useState<string | null>(null);
  const [errorArchivo, setErrorArchivo] = useState<string | null>(null);

  const elegir = useCallback(
    (archivo: File) => {
      const problema = errorFotoPerfil(archivo);
      setErrorArchivo(problema);
      if (!problema) setPorRecortar(crearVista(archivo));
    },
    [crearVista],
  );

  const recortada = useCallback(
    async (archivo: File) => {
      setPorRecortar(null);
      if (!usuarioActual) return;
      const ok = await ejecutar(() => guardarFotoPerfil(usuarioActual.id, archivo, usuarioActual.avatarRuta), T.error);
      if (ok) recargarPerfil();
    },
    [usuarioActual, ejecutar, recargarPerfil],
  );

  const quitar = useCallback(async () => {
    if (!usuarioActual) return;
    const ok = await ejecutar(() => quitarFotoPerfil(usuarioActual.id, usuarioActual.avatarRuta), T.error);
    if (ok) recargarPerfil();
  }, [usuarioActual, ejecutar, recargarPerfil]);

  return {
    url: usuarioActual?.avatarUrl ?? null,
    porRecortar,
    elegir,
    recortada,
    cancelarRecorte: () => setPorRecortar(null),
    quitar,
    ocupado,
    error: errorArchivo ?? error,
  };
};
