import { Text, TextInput, View } from 'react-native';

import { useCampoHoraStyles } from '@/css/Compartido';
import type { CampoHoraProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Hora "09:30" con teclado numérico. Agrega los ":" solo al escribir 4 dígitos. */
export function CampoHora({ etiqueta, valor, onCambiar, deshabilitado }: CampoHoraProps) {
  const COLORES = useColores();
  const styles = useCampoHoraStyles();
  const cambiar = (texto: string) => {
    const digitos = texto.replace(/\D/g, '').slice(0, 4);
    onCambiar(digitos.length === 4 ? `${digitos.slice(0, 2)}:${digitos.slice(2)}` : texto.replace(/[^\d:]/g, '').slice(0, 5));
  };
  return (
    <View style={[styles.contenedor, deshabilitado && styles.deshabilitado]}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={cambiar}
        editable={!deshabilitado}
        keyboardType="numbers-and-punctuation"
        placeholder="09:00"
        placeholderTextColor={COLORES.placeholder}
        maxLength={5}
        accessibilityLabel={etiqueta}
      />
    </View>
  );
}
