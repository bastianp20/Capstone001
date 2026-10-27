import { Pressable, Text, View } from 'react-native';

import { grillaHorasStyles as styles } from '@/css/PedirHoraPage';
import type { GrillaHorasProps } from '@/interfaces';

export function GrillaHoras({ horas, seleccionada, onElegir }: GrillaHorasProps) {
  return (
    <View style={styles.grilla}>
      {horas.map((hora) => {
        const activa = hora === seleccionada;
        return (
          <Pressable
            key={hora}
            onPress={() => onElegir(hora)}
            accessibilityRole="radio"
            accessibilityState={{ selected: activa }}
            style={[styles.hora, activa && styles.horaActiva]}>
            <Text style={[styles.texto, activa && styles.textoActivo]}>{hora}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
