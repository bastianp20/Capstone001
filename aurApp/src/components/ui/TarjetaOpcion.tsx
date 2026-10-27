import { Pressable, Text, View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { tarjetaOpcionStyles as styles } from '@/css/Compartido';
import type { TarjetaOpcionProps } from '@/interfaces';

import { CirculoIcono } from './CirculoIcono';
import { Icono } from './Icono';

/** Opción grande que se elige con un toque (como un radio): centros al pedir hora. */
export function TarjetaOpcion({ icono, titulo, detalle, seleccionada, onPress }: TarjetaOpcionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: seleccionada }}
      style={({ pressed }) => [styles.tarjeta, seleccionada && styles.seleccionada, pressed && styles.presionada]}>
      <CirculoIcono
        icono={icono}
        tamano={40}
        tamanoIcono={20}
        colorIcono={seleccionada ? COLORES.blanco : COLORES.primario}
        colorFondo={seleccionada ? COLORES.primario : COLORES.primarioSuave}
      />
      <View style={styles.textos}>
        <Text style={styles.titulo} numberOfLines={1}>
          {titulo}
        </Text>
        {detalle && (
          <Text style={styles.detalle} numberOfLines={2}>
            {detalle}
          </Text>
        )}
      </View>
      <View style={[styles.radio, seleccionada && styles.radioMarcado]}>
        {seleccionada && <Icono nombre="check" tamano={14} color={COLORES.blanco} grosor={2.8} />}
      </View>
    </Pressable>
  );
}
