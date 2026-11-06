import { Alert, Platform } from 'react-native';

import type { OpcionesConfirmar } from '@/interfaces';

/** Pregunta antes de una acción que no se puede deshacer. Responde true si la persona confirma. */
export const confirmar = ({ titulo, mensaje, textoSi, textoNo }: OpcionesConfirmar): Promise<boolean> => {
  // En la versión web Alert no muestra botones: se usa el confirm del navegador.
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(`${titulo}\n\n${mensaje}`));

  return new Promise((resolver) =>
    Alert.alert(titulo, mensaje, [
      { text: textoNo, style: 'cancel', onPress: () => resolver(false) },
      { text: textoSi, style: 'destructive', onPress: () => resolver(true) },
    ], { cancelable: true, onDismiss: () => resolver(false) }),
  );
};
