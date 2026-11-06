import { Pressable, Text } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { TEXTOS_INICIO } from '@/constants/constants';
import type { BotonPedirHoraProps } from '@/interfaces';

import { useBotonPedirHoraStyles } from '@/css/InicioPage';
import { useColores } from '@/context/TemaContext';

export function BotonPedirHora({ onPress }: BotonPedirHoraProps) {
  const COLORES = useColores();
  const styles = useBotonPedirHoraStyles();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.boton, pressed && styles.presionado]}>
      <Icono nombre="citas" tamano={20} color={COLORES.blanco} grosor={2.2} />
      <Text style={styles.texto}>{TEXTOS_INICIO.pedirHora}</Text>
    </Pressable>
  );
}
