import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── TarjetaUrgenciasCentro y PanelEstadoUci (Mi centro / Resumen) ───
export const useUrgenciasCentroStyles = crearEstilos((COLORES) => ({
  tarjeta: {
    gap: 12,
    padding: 16,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
  },
  titulo: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.texto,
  },
  ayuda: {
    fontFamily: FUENTES.medium,
    fontSize: 13,
    lineHeight: 18,
    color: COLORES.textoSecundario,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  enVivo: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: COLORES.peligroSuave,
    fontFamily: FUENTES.bold,
    fontSize: 11,
    color: COLORES.peligro,
    overflow: 'hidden',
  },
  estados: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  estado: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: 2,
    padding: 12,
    borderRadius: RADIOS.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  estadoActivo: {
    borderColor: COLORES.texto,
  },
  estadoTexto: {
    fontFamily: FUENTES.bold,
    fontSize: 14.5,
  },
  estadoAyuda: {
    fontFamily: FUENTES.medium,
    fontSize: 11.5,
  },
  presionado: {
    opacity: 0.7,
  },
  motivo: {
    gap: 10,
  },
  actualizado: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  desactualizado: {
    padding: 10,
    borderRadius: RADIOS.sm,
    backgroundColor: COLORES.aviso,
    fontFamily: FUENTES.semibold,
    fontSize: 12.5,
    lineHeight: 17,
    color: COLORES.avisoTexto,
    overflow: 'hidden',
  },
}));

// ─── HorarioCentroScreen ───
export const useHorarioCentroStyles = crearEstilos((COLORES) => ({
  cuerpo: {
    gap: 12,
  },
  bajada: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORES.textoSecundario,
  },
  dia: {
    gap: 10,
    padding: 14,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  mitad: {
    flex: 1,
  },
  completo: {
    gap: 8,
    padding: 16,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.primarioSuave,
  },
  completoTitulo: {
    fontFamily: FUENTES.bold,
    fontSize: 16,
    color: COLORES.primarioOscuro,
  },
  pie: {
    gap: 8,
  },
}));
