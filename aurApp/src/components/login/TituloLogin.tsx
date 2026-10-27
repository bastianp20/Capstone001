import { Text, View } from 'react-native';

import { tituloLoginStyles as styles } from '@/css/LoginPage';
import type { TituloLoginProps } from '@/interfaces';

export function TituloLogin({ titulo, subtitulo }: TituloLoginProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      <Text style={styles.subtitulo}>{subtitulo}</Text>
    </View>
  );
}
