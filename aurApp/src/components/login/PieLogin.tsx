import { Pressable, Text, View } from 'react-native';

import { TEXTOS_LOGIN } from '@/constants/constants';
import { pieLoginStyles as styles } from '@/css/LoginPage';
import type { PieLoginProps } from '@/interfaces';

export function PieLogin({ modo, onCambiarModo, onSolicitarCentro }: PieLoginProps) {
  const enIngresar = modo === 'ingresar';
  const { pie } = TEXTOS_LOGIN;

  return (
    <View style={styles.contenedor}>
      {modo !== 'recuperar' && (
        <Pressable
          onPress={() => onCambiarModo(enIngresar ? 'crear' : 'ingresar')}
          hitSlop={8}
          accessibilityRole="link"
          style={({ pressed }) => pressed && styles.presionado}>
          <Text style={styles.textoCuenta}>
            {enIngresar ? pie.sinCuenta : pie.conCuenta}{' '}
            <Text style={styles.enlaceCuenta}>{enIngresar ? pie.registrate : pie.ingresa}</Text>
          </Text>
        </Pressable>
      )}

      <Pressable
        onPress={onSolicitarCentro}
        hitSlop={8}
        accessibilityRole="link"
        style={({ pressed }) => pressed && styles.presionado}>
        <Text style={styles.textoCentro}>
          {pie.centro} <Text style={styles.enlaceCentro}>{pie.solicita}</Text>
        </Text>
      </Pressable>
    </View>
  );
}
