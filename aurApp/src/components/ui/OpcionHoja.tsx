import { Pressable, Text, View } from 'react-native';

import { useOpcionHojaStyles } from '@/css/Compartido';
import type { OpcionHojaProps } from '@/interfaces';

import { Icono } from './Icono';
import { useColores, useTonosTarjeta } from '@/context/TemaContext';

/** Botón grande de una hoja inferior: ícono en un cuadrito y el texto. tono "peligro" = rojo. */
export function OpcionHoja({ icono, texto, tono, onPress, deshabilitada }: OpcionHojaProps) {
  const COLORES = useColores();
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useOpcionHojaStyles();
  const peligro = tono === 'peligro';
  const fondo = peligro ? COLORES.peligro : TONOS_TARJETA[tono].fondo;
  const colorIcono = peligro ? COLORES.blanco : TONOS_TARJETA[tono].icono;
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitada}
      accessibilityRole="button"
      style={({ pressed }) => [styles.opcion, { backgroundColor: fondo }, pressed && styles.presionada, deshabilitada && styles.deshabilitada]}>
      <View style={[styles.cuadro, peligro && styles.cuadroPeligro]}>
        <Icono nombre={icono} tamano={22} color={colorIcono} />
      </View>
      <Text style={[styles.texto, peligro && styles.textoPeligro]}>{texto}</Text>
    </Pressable>
  );
}
