import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── MiRefugioScreen ───
export const useMiRefugioStyles = crearEstilos((COLORES) => ({
  seccion: {
    gap: 12,
    padding: 16,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.superficie,
  },
  lista: {
    gap: 12,
  },
}));

// ─── TarjetaCuposRefugio ───
export const useTarjetaCuposStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    gap: 14,
    padding: 18,
    borderRadius: RADIOS.lg,
    backgroundColor: COLORES.superficie,
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
}));
