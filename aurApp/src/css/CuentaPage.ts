import { StyleSheet } from 'react-native';

import { COLORES, FUENTES } from '@/constants/constants';

// ─── DatosPersonalesScreen ───
export const datosPersonalesStyles = StyleSheet.create({
  formulario: {
    gap: 16,
  },
});

// ─── ContactoScreen ───
export const contactoStyles = StyleSheet.create({
  formulario: {
    gap: 16,
  },
  intro: {
    fontFamily: FUENTES.medium,
    fontSize: 15,
    lineHeight: 22,
    color: COLORES.textoSecundario,
  },
});
