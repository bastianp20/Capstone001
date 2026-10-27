import { Pressable } from 'react-native';

import { COLORES } from '@/constants/constants';
import { botonIconoStyles as styles } from '@/css/Compartido';
import type { BotonIconoProps } from '@/interfaces';

import { Icono } from './Icono';

/** Botón redondo con un ícono: el "+" de Citas, la flecha de volver, etc. */
export function BotonIcono({ icono, etiqueta, onPress, variante = 'blanco', tamano = 48 }: BotonIconoProps) {
  const blanco = variante === 'blanco';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      hitSlop={6}
      style={({ pressed }) => [
        styles.boton,
        blanco ? styles.blanco : styles.translucido,
        { width: tamano, height: tamano, borderRadius: tamano / 2 },
        pressed && styles.presionado,
      ]}>
      <Icono nombre={icono} tamano={Math.round(tamano * 0.46)} color={blanco ? COLORES.primario : COLORES.blanco} grosor={2.4} />
    </Pressable>
  );
}
