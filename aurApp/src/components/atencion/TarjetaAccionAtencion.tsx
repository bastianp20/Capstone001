import { Pressable, Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES, TEXTOS_ATENCION as T, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaAccionAtencionStyles as styles } from '@/css/AtencionPage';
import type { TarjetaAccionAtencionProps } from '@/interfaces';

/** Tarjeta grande y táctil: Registrar atención, Receta o Derivar, con "✓ Hecho" cuando corresponde. */
export function TarjetaAccionAtencion({ icono, tono, titulo, detalle, hecho, onPress }: TarjetaAccionAtencionProps) {
  const colores = TONOS_TARJETA[tono];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.tarjeta, { backgroundColor: colores.fondo, borderColor: colores.iconoFondo }, pressed && styles.presionada]}>
      <View style={[styles.icono, { backgroundColor: colores.iconoFondo }]}>
        <Icono nombre={icono} tamano={24} color={colores.icono} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      {hecho ? (
        <View style={styles.hecho}>
          <Icono nombre="check" tamano={14} color={COLORES.primario} grosor={2.6} />
          <Text style={styles.hechoTexto}>{T.hecho}</Text>
        </View>
      ) : (
        <Text style={styles.detalle}>{detalle}</Text>
      )}
    </Pressable>
  );
}
