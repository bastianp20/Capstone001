import { Text, View } from 'react-native';

import { useTituloSeccionStyles } from '@/css/Compartido';
import type { TituloSeccionProps } from '@/interfaces';

export function TituloSeccion({ texto, accion }: TituloSeccionProps) {
  const styles = useTituloSeccionStyles();
  return (
    <View style={styles.fila}>
      <Text style={styles.texto} accessibilityRole="header">
        {texto}
      </Text>
      {accion}
    </View>
  );
}
