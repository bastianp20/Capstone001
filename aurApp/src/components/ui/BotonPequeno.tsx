import { ActivityIndicator, Pressable, Text } from 'react-native';

import { COLORES } from '@/constants/constants';
import { botonPequenoStyles as styles } from '@/css/Compartido';
import type { BotonPequenoProps } from '@/interfaces';

import { Icono } from './Icono';

const COLOR_TEXTO = { blanco: COLORES.texto, peligro: COLORES.error, sobrePrimario: COLORES.primarioOscuro, primario: COLORES.blanco } as const;

/** Botón chico en forma de píldora: "Cómo llegar", "Cancelar cita", "Ficha PDF". */
export function BotonPequeno({ texto, onPress, icono, variante = 'blanco', cargando, deshabilitado }: BotonPequenoProps) {
  const color = COLOR_TEXTO[variante];
  return (
    <Pressable
      onPress={onPress}
      disabled={cargando || deshabilitado}
      accessibilityRole="button"
      accessibilityState={{ disabled: cargando || deshabilitado, busy: cargando }}
      style={({ pressed }) => [
        styles.boton,
        variante === 'peligro' && styles.peligro,
        variante === 'primario' && styles.primario,
        pressed && styles.presionado,
        deshabilitado && styles.deshabilitado,
      ]}>
      {cargando ? <ActivityIndicator size="small" color={color} /> : icono && <Icono nombre={icono} tamano={16} color={color} grosor={2.2} />}
      <Text style={[styles.texto, { color }]}>{texto}</Text>
    </Pressable>
  );
}
