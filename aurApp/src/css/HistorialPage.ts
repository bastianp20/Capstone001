import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS } from '@/constants/constants';

// ─── LineaDeTiempo ───
export const lineaDeTiempoStyles = StyleSheet.create({
  contenedor: {
    gap: 8,
  },
  grupo: {
    gap: 4,
  },
  mes: {
    fontFamily: FUENTES.extrabold,
    fontSize: 15,
    color: COLORES.texto,
    marginTop: 8,
    marginBottom: 6,
  },
});

// ─── ItemLineaDeTiempo ───
export const itemLineaDeTiempoStyles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    gap: 12,
  },
  guia: {
    width: 14,
    alignItems: 'center',
  },
  punto: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 22,
    borderWidth: 2,
    borderColor: COLORES.fondo,
  },
  linea: {
    flex: 1,
    width: 2,
    marginTop: 2,
    backgroundColor: COLORES.bordeCampo,
  },
  tarjeta: {
    flex: 1,
    marginBottom: 12,
    padding: 14,
  },
  tarjetaBlanca: {
    borderRadius: RADIOS.lg,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.blanco,
  },
  fila: {
    flexDirection: 'row',
    gap: 12,
  },
  textos: {
    flex: 1,
    gap: 5,
    alignItems: 'flex-start',
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 15.5,
    lineHeight: 21,
    color: COLORES.texto,
  },
  subtitulo: {
    fontFamily: FUENTES.semibold,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORES.texto,
  },
});

// ─── DetalleReceta ───
export const detalleRecetaStyles = StyleSheet.create({
  contenedor: {
    alignSelf: 'stretch',
    gap: 8,
    padding: 12,
    borderRadius: RADIOS.sm,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  medicamento: {
    gap: 2,
  },
  nombre: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    color: COLORES.textoSecundario,
  },
});
