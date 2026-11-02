import { Switch, Text, View } from 'react-native';

import { CirculoIcono } from '@/components/ui/CirculoIcono';
import { COLORES, TEXTOS_ALIADO_SOLIDARIO as T, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaAliadoStyles as styles } from '@/css/SolidariaPage';
import type { TarjetaAliadoSolidarioProps } from '@/interfaces';

/** "Aliado solidario" en el perfil del veterinario: el interruptor y sus atenciones gratis. */
export function TarjetaAliadoSolidario({ activo, solidarias, ocupado, onCambiar }: TarjetaAliadoSolidarioProps) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <CirculoIcono icono="corazon" tamano={44} tamanoIcono={22} colorIcono={COLORES.coral} colorFondo={TONOS_TARJETA.durazno.fondo} />
        <View style={styles.textos}>
          <Text style={styles.titulo}>{T.titulo}</Text>
          <Text style={styles.texto}>{T.texto}</Text>
        </View>
        <Switch
          value={activo}
          onValueChange={onCambiar}
          disabled={ocupado}
          trackColor={{ false: COLORES.bordeCampo, true: COLORES.primario }}
          thumbColor={COLORES.blanco}
          accessibilityLabel={T.titulo}
        />
      </View>
      <Text style={styles.atenciones}>{T.atenciones(solidarias)}</Text>
    </View>
  );
}
