import { FUENTES, RADIOS } from '@/constants/constants';

import { crearEstilos } from './crearEstilos';

// ─── HorarioAtencionScreen (veterinario → Mi horario) ───
export const useHorarioAtencionStyles = crearEstilos((COLORES) => ({
  cuerpo: {
    gap: 18,
  },
  bajada: {
    fontFamily: FUENTES.medium,
    fontSize: 14,
    lineHeight: 20,
    color: COLORES.textoSecundario,
  },
  tarjeta: {
    gap: 10,
    padding: 16,
    borderRadius: RADIOS.lg,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  tarjetaTitulo: {
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
  pie: {
    gap: 8,
  },
}));

// ─── DiasLugarHorario (los 7 días de un lugar) ───
export const useDiasLugarStyles = crearEstilos((COLORES) => ({
  dia: {
    gap: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
  primerDia: {
    borderTopWidth: 0,
  },
  horas: {
    flexDirection: 'row',
    gap: 10,
  },
  notaCentro: {
    fontFamily: FUENTES.medium,
    fontSize: 12,
    color: COLORES.textoSecundario,
  },
}));

// ─── CampoComunas ───
export const useCampoComunasStyles = crearEstilos((COLORES) => ({
  contenedor: {
    gap: 10,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: RADIOS.sm,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.superficie,
    fontFamily: FUENTES.semibold,
    fontSize: 15,
    color: COLORES.texto,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORES.primarioSuave,
  },
  chipTexto: {
    fontFamily: FUENTES.semibold,
    fontSize: 13,
    color: COLORES.primarioOscuro,
  },
}));
