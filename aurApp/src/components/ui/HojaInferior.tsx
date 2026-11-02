import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { hojaInferiorStyles as styles } from '@/css/Compartido';
import type { HojaInferiorProps } from '@/interfaces';

/** Hoja que sube desde abajo sobre un velo oscuro; se cierra tocando el velo o con "atrás". */
export function HojaInferior({ visible, titulo, onCerrar, children }: HojaInferiorProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar} statusBarTranslucent>
      <View style={styles.fondo}>
        <Pressable style={styles.velo} onPress={onCerrar} accessibilityLabel={titulo} />
        <View style={[styles.hoja, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.agarre} />
          <Text style={styles.titulo}>{titulo}</Text>
          {children}
        </View>
      </View>
    </Modal>
  );
}
