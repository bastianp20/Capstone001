import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

import { TEXTOS_ATENCION as T } from '@/constants/constants';
import { pildoraEnConsultaStyles as styles } from '@/css/AtencionPage';
import type { PildoraEnConsultaProps } from '@/interfaces';

/** "● En consulta · 18 min" con el punto rojo latiendo. */
export function PildoraEnConsulta({ minutos }: PildoraEnConsultaProps) {
  const latido = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(latido, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(latido, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    animacion.start();
    return () => animacion.stop();
  }, [latido]);

  return (
    <View style={styles.pildora} accessibilityLabel={T.enConsulta(minutos)}>
      <Animated.View style={[styles.punto, { opacity: latido }]} />
      <Text style={styles.texto}>{T.enConsulta(minutos)}</Text>
    </View>
  );
}
