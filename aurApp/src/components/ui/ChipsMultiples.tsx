import { Pressable, Text, View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { chipsMultiplesStyles as styles } from '@/css/Compartido';
import type { ChipsMultiplesProps } from '@/interfaces';

import { Icono } from './Icono';

/** Chips que se pueden marcar varios a la vez (por ejemplo, los síntomas). */
export function ChipsMultiples({ opciones, seleccionadas, onAlternar }: ChipsMultiplesProps) {
  return (
    <View style={styles.contenedor}>
      {opciones.map((opcion) => {
        const marcada = seleccionadas.includes(opcion);
        return (
          <Pressable
            key={opcion}
            onPress={() => onAlternar(opcion)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: marcada }}
            style={[styles.chip, marcada && styles.chipMarcado]}>
            {marcada && <Icono nombre="check" tamano={14} color={COLORES.blanco} grosor={2.6} />}
            <Text style={[styles.texto, marcada && styles.textoMarcado]}>{opcion}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
