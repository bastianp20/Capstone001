import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS } from '@/constants/constants';

// ─── TarjetaCasoModeracion ───
export const tarjetaCasoModeracionStyles = StyleSheet.create({
  tarjeta: {
    gap: 12,
    padding: 14,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.blanco,
    boxShadow: '0 4px 14px rgba(11, 59, 53, 0.07)',
  },
  urgente: {
    borderWidth: 1.5,
    borderColor: COLORES.peligro,
  },
  cabecera: {
    flexDirection: 'row',
    gap: 12,
  },
  foto: {
    width: 64,
    height: 64,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.huellas,
  },
  sinFoto: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE6D5',
  },
  textos: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  filaNombre: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  nombre: {
    fontFamily: FUENTES.extrabold,
    fontSize: 16.5,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  reportes: {
    gap: 8,
    padding: 12,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.fondo,
  },
  reportesTitulo: {
    fontFamily: FUENTES.bold,
    fontSize: 13.5,
    color: COLORES.texto,
  },
  reporte: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  reporteIcono: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  reporteTextos: {
    flex: 1,
    gap: 1,
  },
  reporteMotivo: {
    fontFamily: FUENTES.bold,
    fontSize: 13,
    color: COLORES.texto,
  },
  reporteComentario: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    lineHeight: 17,
    color: COLORES.textoSecundario,
  },
  decision: {
    fontFamily: FUENTES.bold,
    fontSize: 13,
    color: COLORES.primarioOscuro,
  },
  acciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
