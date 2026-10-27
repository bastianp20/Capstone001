import { Text, View } from 'react-native';

import { mensajeFormularioStyles as styles } from '@/css/Compartido';
import type { MensajeFormularioProps } from '@/interfaces';

/** Caja de error o de aviso (por ejemplo, "revisa tu correo"). */
export function MensajeFormulario({ tipo, texto }: MensajeFormularioProps) {
  if (!texto) return null;
  const esError = tipo === 'error';

  return (
    <View
      style={[styles.caja, esError ? styles.cajaError : styles.cajaAviso]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite">
      <Text style={[styles.texto, esError ? styles.textoError : styles.textoAviso]}>{texto}</Text>
    </View>
  );
}
