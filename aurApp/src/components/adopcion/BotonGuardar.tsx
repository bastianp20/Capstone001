import { Pressable } from 'react-native';

import { COLORES, TEXTOS_ADOPTA as T } from '@/constants/constants';
import { botonGuardarStyles as styles } from '@/css/AdoptaPage';
import type { BotonGuardarProps } from '@/interfaces';

import { Icono } from '@/components/ui/Icono';

/** Corazón redondo para guardar un animal (relleno coral cuando está guardado). */
export function BotonGuardar({ guardado, onPress, tamano = 36 }: BotonGuardarProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityState={{ selected: guardado }}
      accessibilityLabel={guardado ? T.quitarGuardado : T.guardar}
      style={({ pressed }) => [styles.boton, { width: tamano, height: tamano, borderRadius: tamano / 2 }, pressed && styles.presionado]}>
      <Icono nombre="corazon" tamano={Math.round(tamano * 0.5)} color={guardado ? COLORES.coral : COLORES.texto} relleno={guardado} />
    </Pressable>
  );
}
