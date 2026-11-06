import { Pressable, Text } from 'react-native';

import { useFilaOpcionStyles } from '@/css/Compartido';
import type { FilaOpcionProps } from '@/interfaces';

import { CirculoIcono } from './CirculoIcono';
import { Icono } from './Icono';
import { useColores, useTonosTarjeta } from '@/context/TemaContext';

/** Fila de una lista de ajustes: ícono en círculo pastel, texto, valor y flecha. */
export function FilaOpcion({ icono, tono, texto, valor, onPress, ultima }: FilaOpcionProps) {
  const COLORES = useColores();
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useFilaOpcionStyles();
  const colores = TONOS_TARJETA[tono];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.fila, !ultima && styles.separador, pressed && styles.presionada]}>
      <CirculoIcono icono={icono} tamano={40} tamanoIcono={20} colorIcono={colores.icono} colorFondo={colores.fondo} />
      <Text style={styles.texto} numberOfLines={1}>
        {texto}
      </Text>
      {valor && <Text style={styles.valor}>{valor}</Text>}
      <Icono nombre="chevronDerecha" tamano={20} color={COLORES.textoSecundario} />
    </Pressable>
  );
}
