import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';

/** Carga la tipografía de la app. Devuelve true cuando está lista. */
export function useFuentesAuraPet() {
  const [cargadas, error] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Si falla la carga seguimos con la fuente del sistema en vez de dejar la app en blanco.
  return cargadas || error !== null;
}
