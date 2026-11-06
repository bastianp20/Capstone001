import { Pressable, Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { TEXTOS_ATENCION as T } from '@/constants/constants';
import { useTarjetaAccionAtencionStyles } from '@/css/AtencionPage';
import type { TarjetaAccionAtencionProps } from '@/interfaces';
import { useColores, useTonosTarjeta } from '@/context/TemaContext';

/** Tarjeta grande y táctil: Registrar atención, Receta o Derivar, con "✓ Hecho" cuando corresponde. */
export function TarjetaAccionAtencion({ icono, tono, titulo, detalle, hecho, onPress }: TarjetaAccionAtencionProps) {
  const COLORES = useColores();
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useTarjetaAccionAtencionStyles();
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
