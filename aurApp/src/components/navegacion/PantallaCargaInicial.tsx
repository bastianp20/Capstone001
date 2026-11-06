import { View } from 'react-native';

import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { usePantallaCentradaStyles } from '@/css/Navegacion';

/** Mientras se averigua qué centros administra la cuenta. */
export function PantallaCargaInicial() {
  const styles = usePantallaCentradaStyles();
  return (
    <View style={styles.pantalla}>
      <EstadoCarga />
    </View>
  );
}
