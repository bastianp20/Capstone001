import { Pressable, Text, View } from 'react-native';

import { COLORES, TEXTOS_SIN_CONEXION as T } from '@/constants/constants';
import { avisoSinConexionStyles as styles } from '@/css/Compartido';
import type { AvisoSinConexionProps } from '@/interfaces';

import { Icono } from './Icono';

/** Franja crema: no hubo señal, el borrador está a salvo y se puede reintentar. */
export function AvisoSinConexion({ visible, reintentando, onReintentar }: AvisoSinConexionProps) {
  if (!visible) return null;
  return (
    <View style={styles.franja} accessibilityRole="alert">
      <Icono nombre="nubeTachada" tamano={20} color={COLORES.avisoTexto} />
      <Text style={styles.texto}>{T.aviso}</Text>
      <Pressable onPress={onReintentar} disabled={reintentando} accessibilityRole="button" hitSlop={8}>
        <Text style={styles.reintentar}>{reintentando ? T.reintentando : T.reintentar}</Text>
      </Pressable>
    </View>
  );
}
