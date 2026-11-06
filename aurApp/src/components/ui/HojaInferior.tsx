import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHojaInferiorStyles } from '@/css/Compartido';
import { useAltoTeclado } from '@/hooks/useAltoTeclado';
import type { HojaInferiorProps } from '@/interfaces';

/** Hoja que sube desde abajo sobre un velo oscuro; se cierra tocando el velo o con "atrás". */
export function HojaInferior({ visible, titulo, onCerrar, children }: HojaInferiorProps) {
  const styles = useHojaInferiorStyles();
  const insets = useSafeAreaInsets();
  const altoTeclado = useAltoTeclado();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar} statusBarTranslucent>
      <View style={styles.fondo}>
        <Pressable style={styles.velo} onPress={onCerrar} accessibilityLabel={titulo} />
        <View style={[styles.hoja, { paddingBottom: altoTeclado ? altoTeclado + 16 : insets.bottom + 16 }]}>
          <View style={styles.agarre} />
          <Text style={styles.titulo}>{titulo}</Text>
          {children}
        </View>
      </View>
    </Modal>
  );
}
