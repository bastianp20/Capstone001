import { StyleSheet } from 'react-native';

import { ALTURA_BARRA_NAVEGACION, COLORES, FUENTES, MARGEN_PANTALLA } from '@/constants/constants';

// ─── BarraNavegacion ───
export const barraNavegacionStyles = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  barra: {
    height: ALTURA_BARRA_NAVEGACION,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    backgroundColor: COLORES.blanco,
    borderRadius: ALTURA_BARRA_NAVEGACION / 2,
    boxShadow: '0 10px 30px rgba(11, 59, 53, 0.14)',
  },
  boton: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  contenedorIcono: {
    width: 52,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenedorIconoActivo: {
    backgroundColor: COLORES.primario,
  },
  etiqueta: {
    fontFamily: FUENTES.semibold,
    fontSize: 11.5,
    color: COLORES.texto,
  },
  etiquetaActiva: {
    fontFamily: FUENTES.bold,
    color: COLORES.primario,
  },
});

// ─── PantallaCargaInicial / PantallaSinCentro ───
export const pantallaCentradaStyles = StyleSheet.create({
  pantalla: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: MARGEN_PANTALLA,
    backgroundColor: COLORES.fondo,
  },
});
