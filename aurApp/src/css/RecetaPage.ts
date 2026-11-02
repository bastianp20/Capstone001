import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS, TONOS_TARJETA } from '@/constants/constants';

// ─── RecetaAtencionScreen ───
export const recetaStyles = StyleSheet.create({
  cuerpo: {
    gap: 16,
  },
  tituloFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 17,
    color: COLORES.texto,
  },
  contador: {
    minWidth: 24,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    textAlign: 'center',
    backgroundColor: TONOS_TARJETA.lavanda.fondo,
    fontFamily: FUENTES.bold,
    fontSize: 12.5,
    color: TONOS_TARJETA.lavanda.icono,
  },
  lista: {
    gap: 10,
  },
  pie: {
    gap: 8,
  },
});

// ─── TarjetaMedicamento ───
export const tarjetaMedicamentoStyles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.blanco,
    borderWidth: 1,
    borderColor: COLORES.borde,
    boxShadow: '0 6px 14px rgba(11, 59, 53, 0.06)',
  },
  barra: {
    width: 48,
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: TONOS_TARJETA.lavanda.fondo,
  },
  cuerpo: {
    flex: 1,
    gap: 8,
    padding: 14,
  },
  nombre: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: TONOS_TARJETA.lavanda.fondo,
  },
  chipTexto: {
    fontFamily: FUENTES.semibold,
    fontSize: 12,
    color: COLORES.texto,
  },
  acciones: {
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingRight: 14,
    gap: 14,
  },
});

// ─── HojaMedicamento ───
export const hojaMedicamentoStyles = StyleSheet.create({
  formulario: {
    gap: 12,
  },
});

// ─── BotonCanal ───
export const botonCanalStyles = StyleSheet.create({
  boton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.blanco,
    boxShadow: '0 6px 16px rgba(11, 59, 53, 0.08)',
  },
  presionado: {
    transform: [{ scale: 0.97 }],
  },
  deshabilitado: {
    opacity: 0.5,
  },
  circulo: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  texto: {
    fontFamily: FUENTES.semibold,
    fontSize: 14,
    color: COLORES.texto,
  },
});

// ─── RecetaLista ───
export const recetaListaStyles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  halo: {
    padding: 10,
    borderRadius: 70,
    backgroundColor: 'rgba(15, 143, 128, 0.08)',
  },
  titulo: {
    fontFamily: FUENTES.extrabold,
    fontSize: 22,
    color: COLORES.texto,
  },
  texto: {
    fontFamily: FUENTES.medium,
    fontSize: 15.5,
    lineHeight: 22,
    color: COLORES.texto,
    textAlign: 'center',
  },
  hoja: {
    marginVertical: 8,
    borderRadius: 10,
    transform: [{ rotate: '-4deg' }],
    boxShadow: '0 14px 28px rgba(11, 59, 53, 0.16)',
  },
  canales: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 10,
  },
  volver: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  volverTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.primario,
  },
});
