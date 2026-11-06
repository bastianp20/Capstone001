import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useColores } from '@/context/TemaContext';
import { useBotonPequenoStyles } from '@/css/Compartido';
import type { BotonPequenoProps, Paleta } from '@/interfaces';

import { Icono } from './Icono';

const colorTexto = (c: Paleta) => ({ blanco: c.texto, peligro: c.error, sobrePrimario: c.primarioOscuro, primario: c.blanco, coral: c.blanco });

/** Botón chico en forma de píldora: "Cómo llegar", "Cancelar cita", "Ficha PDF". */
export function BotonPequeno({ texto, onPress, icono, variante = 'blanco', cargando, deshabilitado }: BotonPequenoProps) {
  const styles = useBotonPequenoStyles();
  const color = colorTexto(useColores())[variante];
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
        variante === 'coral' && styles.coral,
        pressed && styles.presionado,
        deshabilitado && styles.deshabilitado,
      ]}>
      {cargando ? <ActivityIndicator size="small" color={color} /> : icono && <Icono nombre={icono} tamano={16} color={color} grosor={2.2} />}
      <Text style={[styles.texto, { color }]}>{texto}</Text>
    </Pressable>
  );
}
