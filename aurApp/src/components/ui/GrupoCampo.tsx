import { Text, View } from 'react-native';

import { etiquetaCampoStyles as styles } from '@/css/Compartido';
import type { GrupoCampoProps } from '@/interfaces';

/** Título (y ayuda opcional) sobre un grupo de opciones de un formulario. */
export function GrupoCampo({ titulo, ayuda, children }: GrupoCampoProps) {
  return (
    <View style={styles.grupo}>
      <Text style={styles.texto}>{titulo}</Text>
      {children}
      {ayuda && <Text style={styles.ayuda}>{ayuda}</Text>}
    </View>
  );
}
