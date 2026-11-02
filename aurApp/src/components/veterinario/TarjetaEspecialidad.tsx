import { Pressable, Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaEspecialidadStyles as styles } from '@/css/MisEspecialidadesPage';
import type { TarjetaEspecialidadProps } from '@/interfaces';

/** Tarjeta cuadrada de una especialidad, con su ícono; marcada = borde verde y check. */
export function TarjetaEspecialidad({ nombre, icono, tono, marcada, onPress }: TarjetaEspecialidadProps) {
  const colores = TONOS_TARJETA[tono];
  return (
    <Pressable onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked: marcada }} style={({ pressed }) => [styles.tarjeta, marcada && styles.marcada, pressed && styles.presionada]}>
      <View style={[styles.circulo, { backgroundColor: colores.fondo }]}>
        <Icono nombre={icono} tamano={26} color={colores.icono} />
      </View>
      <Text style={styles.nombre} numberOfLines={2}>
        {nombre}
      </Text>
      {marcada && (
        <View style={styles.check}>
          <Icono nombre="check" tamano={12} color={COLORES.blanco} grosor={3} />
        </View>
      )}
    </Pressable>
  );
}
