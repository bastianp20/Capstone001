import { Text, View } from 'react-native';

import { AvatarPersona } from '@/components/ui/AvatarPersona';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { TEXTOS_URGENCIAS as T } from '@/constants/constants';
import { useTarjetaUrgenciaStyles } from '@/css/UrgenciasPage';
import type { TarjetaVetUrgenciaProps } from '@/interfaces';
import { llamar } from '@/lib/urgencias';

/** Un veterinario que atiende urgencias 24/7 y aceptó mostrar su teléfono. */
export function TarjetaVetUrgencia({ veterinario: v }: TarjetaVetUrgenciaProps) {
  const styles = useTarjetaUrgenciaStyles();
  const zona = [v.aDomicilio ? T.aDomicilio : null, v.comunas.join(', ') || null].filter(Boolean).join(' · ');
  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <AvatarPersona nombre={v.nombre} fotoUrl={v.avatarUrl} tamano={48} />
        <View style={styles.textos}>
          <Text style={styles.nombre}>{v.nombre}</Text>
          {!!zona && <Text style={styles.direccion}>{zona}</Text>}
        </View>
      </View>
      <BotonPequeno texto={T.llamar} icono="telefono" variante="peligro" onPress={() => llamar(v.telefono)} />
    </View>
  );
}
