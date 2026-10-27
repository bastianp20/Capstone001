import { View } from 'react-native';

import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { pantallaCentradaStyles as styles } from '@/css/Navegacion';

/** Mientras se averigua qué centros administra la cuenta. */
export function PantallaCargaInicial() {
  return (
    <View style={styles.pantalla}>
      <EstadoCarga />
    </View>
  );
}
