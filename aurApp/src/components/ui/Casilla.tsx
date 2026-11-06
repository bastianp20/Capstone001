import { Pressable, Text, View } from 'react-native';

import { useCasillaStyles } from '@/css/Compartido';
import type { CasillaProps } from '@/interfaces';

import { Icono } from './Icono';
import { useColores } from '@/context/TemaContext';

/** Casilla para marcar ("Entiendo que…"). Toda la fila es tocable. */
export function Casilla({ texto, marcada, onCambiar }: CasillaProps) {
  const COLORES = useColores();
  const styles = useCasillaStyles();
  return (
    <Pressable onPress={() => onCambiar(!marcada)} accessibilityRole="checkbox" accessibilityState={{ checked: marcada }} style={styles.fila}>
      <View style={[styles.caja, marcada && styles.cajaMarcada]}>{marcada && <Icono nombre="check" tamano={15} color={COLORES.blanco} grosor={3} />}</View>
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}
