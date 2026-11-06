import { useEffect, useState } from 'react';
import { Keyboard, type KeyboardEvent, Platform } from 'react-native';

// iOS avisa antes de abrir (se anima junto al teclado); Android, cuando ya abrió.
const AL_MOSTRAR = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const AL_OCULTAR = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

/**
 * Cuánto tapa el teclado (0 si está cerrado). Con edge-to-edge (Expo 54+) Android ya no achica
 * la pantalla al abrir el teclado, así que cada pantalla deja ese espacio libre abajo.
 * `medir` permite calcular lo que tapa de verdad (por ejemplo, contra el borde de la pantalla).
 */
export function useAltoTeclado(medir?: (e: KeyboardEvent) => Promise<number>) {
  const [alto, setAlto] = useState(0);

  useEffect(() => {
    const mostrar = Keyboard.addListener(AL_MOSTRAR, async (e) => {
      setAlto(medir ? await medir(e) : e.endCoordinates.height);
    });
    const ocultar = Keyboard.addListener(AL_OCULTAR, () => setAlto(0));
    return () => {
      mostrar.remove();
      ocultar.remove();
    };
    // medir se lee solo al abrir: no hace falta volver a suscribirse si cambia
  }, []);

  return alto;
}
