import { Pressable, Text, View } from 'react-native';

import { AvatarMascota } from '@/components/ui/AvatarMascota';
import { TEXTOS_PEDIR_HORA as T } from '@/constants/constants';
import { useMiniMascotaCitaStyles } from '@/css/PedirHoraPage';
import type { MiniMascotaCitaProps } from '@/interfaces';
import { edadDesde } from '@/lib/fechas';

/** "Toby · Beagle, 3 años" con su foto y "Cambiar" (vuelve al primer paso). */
export function MiniMascotaCita({ mascota: m, onCambiar }: MiniMascotaCitaProps) {
  const styles = useMiniMascotaCitaStyles();
  const detalle = [m.raza, edadDesde(m.fechaNacimiento)].filter(Boolean).join(', ');
  return (
    <View style={styles.tarjeta}>
      <AvatarMascota nombre={m.nombre} fotoUrl={m.fotoUrl} tamano={44} />
      <Text style={styles.texto} numberOfLines={1}>
        <Text style={styles.nombre}>{m.nombre}</Text>
        {detalle ? ` · ${detalle}` : ''}
      </Text>
      <Pressable onPress={onCambiar} accessibilityRole="button" hitSlop={8}>
        <Text style={styles.cambiar}>{T.cambiar}</Text>
      </Pressable>
    </View>
  );
}
