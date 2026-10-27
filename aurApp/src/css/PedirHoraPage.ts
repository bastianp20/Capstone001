import { StyleSheet } from 'react-native';

import { COLORES, FUENTES, RADIOS } from '@/constants/constants';

// ─── SelectorDestino ───
export const selectorDestinoStyles = StyleSheet.create({
  lista: {
    gap: 10,
  },
});

// ─── GrillaDias ───
export const grillaDiasStyles = StyleSheet.create({
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dia: {
    width: 62,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: RADIOS.sm,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.blanco,
  },
  diaActivo: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  diaSemana: {
    fontFamily: FUENTES.bold,
    fontSize: 11,
    color: COLORES.textoSecundario,
  },
  numero: {
    fontFamily: FUENTES.extrabold,
    fontSize: 20,
    lineHeight: 24,
    color: COLORES.texto,
  },
  mes: {
    fontFamily: FUENTES.bold,
    fontSize: 11,
    color: COLORES.textoSecundario,
  },
  textoActivo: {
    color: COLORES.blanco,
  },
});

// ─── GrillaHoras ───
export const grillaHorasStyles = StyleSheet.create({
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hora: {
    width: 74,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORES.bordeCampo,
    backgroundColor: COLORES.blanco,
  },
  horaActiva: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario,
  },
  texto: {
    fontFamily: FUENTES.bold,
    fontSize: 14,
    color: COLORES.texto,
  },
  textoActivo: {
    color: COLORES.blanco,
  },
});
