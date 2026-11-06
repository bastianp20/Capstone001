import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── PostularAdopcionScreen y sus pasos ───
export const usePostularAdopcionStyles = crearEstilos((COLORES) => ({
  paso: {
    gap: 20,
  },
  pie: {
    gap: 8,
  },
  animal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: RADIOS.md,
    backgroundColor: COLORES.superficie,
  },
  animalTextos: {
    flex: 1,
    gap: 2,
  },
  animalNombre: {
    fontFamily: FUENTES.bold,
    fontSize: 15.5,
    color: COLORES.texto,
  },
  animalDetalle: {
    fontFamily: FUENTES.medium,
    fontSize: 12.5,
    color: COLORES.textoSecundario,
  },
  motivoResumen: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORES.texto,
  },
  error: {
    fontFamily: FUENTES.semibold,
    fontSize: 12.5,
    color: COLORES.error,
  },
}));

// ─── ReportarAdopcionScreen ───
export const useReportarAdopcionStyles = crearEstilos((COLORES) => ({
  cuerpo: {
    gap: 18,
  },
  bajada: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORES.textoSecundario,
  },
  pie: {
    gap: 8,
  },
}));

// ─── GrillaMotivosReporte ───
export const useGrillaMotivosStyles = crearEstilos((COLORES) => ({
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  motivo: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: 10,
    padding: 14,
    borderRadius: RADIOS.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  elegido: {
    borderColor: COLORES.texto,
  },
  icono: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: COLORES.superficie,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.texto,
  },
}));
