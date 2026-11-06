import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import { CALIDAD_FOTO_ADOPCION, MAX_FOTOS_ADOPCION, MAX_MB_FOTO_ADOPCION, TEXTOS_PUBLICAR as T } from '@/constants/constants';
import type { FotoNuevaAdopcion } from '@/interfaces';

const BYTES_POR_MB = 1024 * 1024;
const opciones: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [4, 5], quality: CALIDAD_FOTO_ADOPCION };

/**
 * Fotos para "Dar en adopción": la hoja con Cámara / Galería, los permisos y el límite de tamaño.
 * Avisa a quien la usa con onAgregar(foto) u onError(mensaje); no guarda la lista (eso lo hace el formulario).
 */
export function useFotosAdopcion(cantidadActual: number, onAgregar: (foto: FotoNuevaAdopcion) => void, onError: (mensaje: string) => void) {
  const [hojaAbierta, setHojaAbierta] = useState(false);

  const recibir = (resultado: ImagePicker.ImagePickerResult) => {
    setHojaAbierta(false);
    if (resultado.canceled) return;
    const foto = resultado.assets[0];
    if (foto.fileSize && foto.fileSize > MAX_MB_FOTO_ADOPCION * BYTES_POR_MB) return onError(T.errores.fotoPeso);
    onAgregar({ uri: foto.uri, tipo: foto.mimeType ?? 'image/jpeg' });
  };

  const tomar = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) return onError(T.sinPermisoCamara);
    recibir(await ImagePicker.launchCameraAsync(opciones));
  };

  const elegir = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) return onError(T.sinPermisoGaleria);
    recibir(await ImagePicker.launchImageLibraryAsync(opciones));
  };

  return {
    hojaAbierta,
    abrir: () => (cantidadActual >= MAX_FOTOS_ADOPCION ? onError(T.errores.fotoMaximo) : setHojaAbierta(true)),
    cerrar: () => setHojaAbierta(false),
    tomar,
    elegir,
  };
}
