import { Pressable, Text, View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { chipIconoStyles, chipsOpcionStyles as styles } from '@/css/Compartido';
import type { ChipsOpcionProps } from '@/interfaces';

import { Icono } from './Icono';

/** Chips para elegir UNA opción (o ninguna). Con permitirQuitar, tocar la elegida la deja sin elegir. */
export function ChipsOpcion<V extends string>({ opciones, valor, onCambiar, permitirQuitar = false }: ChipsOpcionProps<V>) {
  return (
    <View style={styles.contenedor} accessibilityRole="radiogroup">
      {opciones.map((o) => {
        const activa = o.valor === valor;
        const color = activa ? COLORES.blanco : COLORES.texto;
        return (
          <Pressable
            key={o.valor}
            onPress={() => onCambiar(activa && permitirQuitar ? null : o.valor)}
            accessibilityRole="radio"
            accessibilityState={{ selected: activa }}
            style={({ pressed }) => [chipIconoStyles.chip, activa && chipIconoStyles.activo, pressed && chipIconoStyles.presionado]}>
            {o.icono && <Icono nombre={o.icono} tamano={15} color={activa ? COLORES.blanco : COLORES.primario} />}
            <Text style={[chipIconoStyles.texto, { color }]}>{o.texto}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
