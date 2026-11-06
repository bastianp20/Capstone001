import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/** Vuelve a pedir los datos cuando se regresa a la pantalla (no la primera vez: esa ya la carga su hook). */
export function useRecargarAlVolver(recargar: () => unknown) {
  const primeraVez = useRef(true);
  const ultima = useRef(recargar);
  ultima.current = recargar;

  useFocusEffect(
    useCallback(() => {
      if (primeraVez.current) {
        primeraVez.current = false;
        return;
      }
      ultima.current();
    }, []),
  );
}
