import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS } from '@/constants/constants';

// ─── MisEspecialidadesScreen ───
export const misEspecialidadesStyles = StyleSheet.create({
  cuerpo: {
    gap: 16,
  },
  bajada: {
    fontFamily: FUENTES.medium,
    fontSize: 15,
    lineHeight: 21,
    color: COLORES.texto,
    textAlign: 'center',
  },
  general: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: COLORES.primarioSuave,
  },
  generalTexto: {
    fontFamily: FUENTES.semibold,
    fontSize: 13,
    color: COLORES.primarioOscuro,
  },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cantidad: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
  },
  boton: {
    flex: 1,
  },
});

// ─── TarjetaEspecialidad ───
export const tarjetaEspecialidadStyles = StyleSheet.create({
  tarjeta: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: RADIOS.md,
    borderWidth: 1.5,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.blanco,
  },
  marcada: {
    borderWidth: 2,
    borderColor: COLORES.primario,
    backgroundColor: 'rgba(221, 243, 238, 0.6)',
  },
  presionada: {
    transform: [{ scale: 0.97 }],
  },
  circulo: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  nombre: {
    fontFamily: FUENTES.semibold,
    fontSize: 15,
    color: COLORES.texto,
    textAlign: 'center',
  },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: COLORES.primario,
  },
});
