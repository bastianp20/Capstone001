import { Pressable, Text } from 'react-native';

import { COLORES } from '@/constants/constants';
import { botonAgregarStyles as styles } from '@/css/Compartido';
import type { BotonAgregarProps } from '@/interfaces';

import { Icono } from './Icono';

/** Botón ancho con borde punteado verde: "+ Agregar medicamento". */
export function BotonAgregar({ texto, onPress }: BotonAgregarProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.boton, pressed && styles.presionado]}>
      <Icono nombre="mas" tamano={18} color={COLORES.primario} grosor={2.4} />
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}
