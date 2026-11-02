import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { TEXTOS_REFUGIOS as T } from '@/constants/constants';
import { tarjetaSumateStyles as styles } from '@/css/AdoptaPage';
import type { TarjetaSumateRefugioProps } from '@/interfaces';

/** "¿Tienes un refugio?": abre la página de la web para postularlo. */
export function TarjetaSumateRefugio({ onPress }: TarjetaSumateRefugioProps) {
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>{T.sumateTitulo}</Text>
      <Text style={styles.texto}>{T.sumateTexto}</Text>
      <View>
        <BotonPequeno texto={T.sumate} icono="flechaDerecha" onPress={onPress} />
      </View>
    </View>
  );
}
