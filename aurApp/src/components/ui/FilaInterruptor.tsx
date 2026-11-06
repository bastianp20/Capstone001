import { Switch, Text, View } from 'react-native';

import { useFilaInterruptorStyles } from '@/css/Compartido';
import type { FilaInterruptorProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

export function FilaInterruptor({ texto, valor, onCambiar }: FilaInterruptorProps) {
  const COLORES = useColores();
  const styles = useFilaInterruptorStyles();
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
