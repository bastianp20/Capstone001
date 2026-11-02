import { Pressable, Text, View } from 'react-native';

import { controlSegmentadoStyles as styles } from '@/css/Compartido';
import type { ControlSegmentadoProps } from '@/interfaces';

/** Dos o tres opciones excluyentes en una píldora (la activa, en oscuro). */
export function ControlSegmentado<V extends string>({ opciones, valor, onCambiar }: ControlSegmentadoProps<V>) {
  return (
    <View style={styles.contenedor} accessibilityRole="tablist">
      {opciones.map((o) => {
        const activa = o.valor === valor;
        return (
          <Pressable
            key={o.valor}
            onPress={() => onCambiar(o.valor)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activa }}
            style={[styles.opcion, activa && styles.activa]}>
            <Text style={[styles.texto, activa && styles.textoActivo]} numberOfLines={1}>
              {o.texto}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
