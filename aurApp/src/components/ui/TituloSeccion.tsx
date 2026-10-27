import { Text, View } from 'react-native';

import { tituloSeccionStyles as styles } from '@/css/Compartido';
import type { TituloSeccionProps } from '@/interfaces';

export function TituloSeccion({ texto, accion }: TituloSeccionProps) {
  return (
    <View style={styles.fila}>
      <Text style={styles.texto} accessibilityRole="header">
        {texto}
      </Text>
      {accion}
    </View>
  );
}
