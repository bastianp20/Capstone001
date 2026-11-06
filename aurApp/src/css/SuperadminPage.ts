import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── ResumenSuperadminScreen ───
export const useResumenSuperadminStyles = crearEstilos(() => ({
  grilla: {
    gap: 10,
    marginTop: -50, // se monta sobre la onda del encabezado
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  seccion: {
    gap: 10,
  },
}));

// ─── Tarjetas del superadmin (solicitudes, mensajes, eliminaciones, planes) ───
export const useTarjetaSuperadminStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    gap: 8,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
    boxShadow: '0 4px 14px rgba(11, 59, 53, 0.07)',
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 15.5,
    color: COLORES.texto,
  },
  detalle: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.textoSecundario,
  },
  fecha: {
    fontFamily: FUENTES.semibold,
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
  cuerpo: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORES.texto,
  },
  acciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
}));
