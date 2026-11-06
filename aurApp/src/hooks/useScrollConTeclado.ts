import { type ComponentRef, useRef } from 'react';
import { type KeyboardEvent, type NativeScrollEvent, type NativeSyntheticEvent, ScrollView, TextInput, View } from 'react-native';

import type { CajaEnVentana, VistaMedible } from '@/interfaces';

import { useAltoTeclado } from './useAltoTeclado';

const MARGEN_SOBRE_TECLADO = 24;
const ESPERA_LAYOUT_MS = 80;

const medirEnVentana = (vista: VistaMedible | null) =>
  new Promise<CajaEnVentana | null>((resolver) => {
    if (!vista) return resolver(null);
    vista.measureInWindow((_x, y, _w, h) => resolver(h ? { y, alto: h } : null));
  });

/**
 * Formularios con scroll: deja libre lo que tapa el teclado y lleva a la vista el campo que se está
 * escribiendo (al abrir el teclado y al tocar otro campo con el teclado ya abierto).
 * Uso: <View ref={contenedorRef} style={{ paddingBottom: alto }}><ScrollView ref={scrollRef} {...scrollProps} />
 */
export function useScrollConTeclado() {
  const contenedorRef = useRef<ComponentRef<typeof View>>(null);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const desplazamiento = useRef(0);

  const llevarCampoALaVista = async () => {
    const campo = TextInput.State.currentlyFocusedInput() as VistaMedible | null;
    const [c, s] = await Promise.all([medirEnVentana(campo), medirEnVentana(scrollRef.current)]);
    if (!c || !s) return;
    const sobra = c.y + c.alto + MARGEN_SOBRE_TECLADO - (s.y + s.alto);
    const falta = s.y - c.y;
    if (sobra > 0) scrollRef.current?.scrollTo({ y: desplazamiento.current + sobra, animated: true });
    else if (falta > 0) scrollRef.current?.scrollTo({ y: Math.max(0, desplazamiento.current - falta - MARGEN_SOBRE_TECLADO), animated: true });
  };

  // Lo que tapa de verdad: desde donde empieza el teclado hasta el borde inferior de la pantalla
  const medir = async (e: KeyboardEvent) => {
    const cont = await medirEnVentana(contenedorRef.current);
    const tapa = cont ? cont.y + cont.alto - e.endCoordinates.screenY : e.endCoordinates.height;
    setTimeout(llevarCampoALaVista, ESPERA_LAYOUT_MS);
    return Math.max(0, tapa);
  };

  const alto = useAltoTeclado(medir);

  return {
    alto,
    contenedorRef,
    scrollRef,
    scrollProps: {
      scrollEventThrottle: 16,
      keyboardShouldPersistTaps: 'handled' as const,
      onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        desplazamiento.current = e.nativeEvent.contentOffset.y;
      },
      // Con el teclado abierto, tocar otro campo no vuelve a avisar: se revisa después del toque
      onTouchEnd: () => {
        if (alto > 0) setTimeout(llevarCampoALaVista, ESPERA_LAYOUT_MS * 2);
      },
    },
  };
}
