import { Pressable, Text } from 'react-native';

import { useBotonAgregarStyles } from '@/css/Compartido';
import type { BotonAgregarProps } from '@/interfaces';

import { Icono } from './Icono';
import { useColores } from '@/context/TemaContext';

/** Botón ancho con borde punteado verde: "+ Agregar medicamento". */
export function BotonAgregar({ texto, onPress }: BotonAgregarProps) {
  const COLORES = useColores();
  const styles = useBotonAgregarStyles();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.boton, pressed && styles.presionado]}>
      <Icono nombre="mas" tamano={18} color={COLORES.primario} grosor={2.4} />
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}
