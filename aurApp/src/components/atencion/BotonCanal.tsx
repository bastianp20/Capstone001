import { Pressable, Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { CANALES_RECETA } from '@/constants/constants';
import { botonCanalStyles as styles } from '@/css/RecetaPage';
import type { BotonCanalProps } from '@/interfaces';

/** WhatsApp, Correo o Guardar PDF: ícono en un círculo de color y el nombre. */
export function BotonCanal({ canal, onPress, deshabilitado }: BotonCanalProps) {
  const c = CANALES_RECETA[canal];
  return (
    <Pressable onPress={onPress} disabled={deshabilitado} accessibilityRole="button" style={({ pressed }) => [styles.boton, pressed && styles.presionado, deshabilitado && styles.deshabilitado]}>
      <View style={[styles.circulo, { backgroundColor: c.fondo }]}>
        <Icono nombre={c.icono} tamano={22} color={c.color} />
      </View>
      <Text style={styles.texto} numberOfLines={1}>
        {c.texto}
      </Text>
    </Pressable>
  );
}
