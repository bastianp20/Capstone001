import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

import { guardarFotoPerfil, quitarFotoPerfil } from '@/Api/postInfo';
import { useAuth } from '@/Auth/AuthContext';
import { CALIDAD_FOTO_PERFIL, TEXTOS_FOTO_PERFIL as T } from '@/constants/constants';

import { useAccion } from './useAccion';

// Foto de perfil (opcional, todos los roles): tomarla con la cámara o elegirla de la galería
// (el teléfono la deja cuadrada con su propio recorte), subirla y quitarla.
export function useFotoPerfil() {
  const { usuarioActual, recargarPerfil } = useAuth();
  const [abierta, setAbierta] = useState(false);
  const { ejecutar, ocupado, error, setError, limpiarError } = useAccion();

  const subir = useCallback(
    async (resultado: ImagePicker.ImagePickerResult) => {
      if (resultado.canceled || !usuarioActual) return;
      const foto = resultado.assets[0];
      const ok = await ejecutar(
        () => guardarFotoPerfil(usuarioActual.id, foto.uri, foto.mimeType ?? 'image/jpeg', usuarioActual.avatarRuta),
        T.error,
      );
      if (ok) {
        setAbierta(false);
        recargarPerfil();
      }
    },
    [usuarioActual, ejecutar, recargarPerfil],
  );

  const opciones: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: CALIDAD_FOTO_PERFIL };

  const tomar = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) return setError(T.sinPermisoCamara);
    subir(await ImagePicker.launchCameraAsync(opciones));
  };

  const elegir = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) return setError(T.sinPermisoGaleria);
    subir(await ImagePicker.launchImageLibraryAsync(opciones));
  };

  const quitar = async () => {
    if (!usuarioActual) return;
    const ok = await ejecutar(() => quitarFotoPerfil(usuarioActual.id, usuarioActual.avatarRuta), T.error);
    if (ok) {
      setAbierta(false);
      recargarPerfil();
    }
  };

  return {
    fotoUrl: usuarioActual?.avatarUrl ?? null,
    abierta,
    abrir: () => {
      limpiarError();
      setAbierta(true);
    },
    cerrar: () => !ocupado && setAbierta(false),
    tomar,
    elegir,
    quitar,
    ocupado,
    error,
  };
}
