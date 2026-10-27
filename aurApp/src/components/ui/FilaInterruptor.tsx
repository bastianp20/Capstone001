import { Switch, Text, View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { filaInterruptorStyles as styles } from '@/css/Compartido';
import type { FilaInterruptorProps } from '@/interfaces';

export function FilaInterruptor({ texto, valor, onCambiar }: FilaInterruptorProps) {
  return (
    <View style={styles.fila}>
      <Text style={styles.texto}>{texto}</Text>
      <Switch
        value={valor}
        onValueChange={onCambiar}
        trackColor={{ false: COLORES.bordeCampo, true: COLORES.primario }}
        thumbColor={COLORES.blanco}
        accessibilityLabel={texto}
      />
    </View>
  );
}
