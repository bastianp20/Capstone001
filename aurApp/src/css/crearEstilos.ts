import { StyleSheet } from 'react-native';

type Estilos = Parameters<typeof StyleSheet.create>[0];

import { type Paleta, PALETA_CLARA, PALETA_OSCURA, TONOS_TARJETA_CLARO, TONOS_TARJETA_OSCURO, type TonosTarjeta } from '@/constants/constants';
import { useTema } from '@/context/TemaContext';

/**
 * Estilos que dependen del tema. Se arman una vez por paleta (claro y oscuro) y el hook
 * devuelve los del tema actual, así cambiar de tema es instantáneo y no recrea nada.
 *
 *   export const useTarjetaStyles = crearEstilos((COLORES) => ({ tarjeta: { backgroundColor: COLORES.superficie } }));
 *   const styles = useTarjetaStyles();
 */
export function crearEstilos<T extends Estilos>(
  armar: (COLORES: Paleta, TONOS_TARJETA: TonosTarjeta) => T & Estilos,
): () => Readonly<T> {
  const claro = StyleSheet.create(armar(PALETA_CLARA, TONOS_TARJETA_CLARO));
  const oscuro = StyleSheet.create(armar(PALETA_OSCURA, TONOS_TARJETA_OSCURO));
  return function useEstilos() {
    return useTema().esOscuro ? oscuro : claro;
  };
}
