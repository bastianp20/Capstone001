import { View } from 'react-native';

import { useHuellasDecorativasStyles } from '@/css/Compartido';
import type { HuellasDecorativasProps } from '@/interfaces';

import { Icono } from './Icono';

/** Huellitas de adorno en posiciones fijas. No reciben toques. */
export function HuellasDecorativas({ huellas, color }: HuellasDecorativasProps) {
  const styles = useHuellasDecorativasStyles();
  return (
    <View style={styles.capa} pointerEvents="none">
      {huellas.map((h, i) => (
        <View
          key={i}
          style={[styles.huella, { top: h.top, left: h.left, right: h.right, transform: [{ rotate: `${h.rotacion}deg` }] }]}>
          <Icono nombre="huella" tamano={h.tamano} color={h.color ?? color} grosor={1.6} />
        </View>
      ))}
    </View>
  );
}
