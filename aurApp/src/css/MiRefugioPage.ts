import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS } from '@/constants/constants';

// ─── MiRefugioScreen ───
export const miRefugioStyles = StyleSheet.create({
  seccion: {
    gap: 12,
    padding: 16,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.blanco,
  },
  lista: {
    gap: 12,
  },
});

// ─── TarjetaCuposRefugio ───
export const tarjetaCuposStyles = StyleSheet.create({
  tarjeta: {
    gap: 14,
    padding: 18,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.blanco,
    boxShadow: '0 8px 20px rgba(11, 59, 53, 0.08)',
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 15,
    color: COLORES.texto,
    textAlign: 'center',
  },
  deTotal: {
    fontFamily: FUENTES.semibold,
    fontSize: 13.5,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
  estado: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
    textAlign: 'center',
  },
});
