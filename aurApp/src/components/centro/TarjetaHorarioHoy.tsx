import { Text } from 'react-native';

import { TarjetaPastel } from '@/components/ui/TarjetaPastel';
import { TEXTOS_CENTRO } from '@/constants/constants';
import { tarjetaHorarioHoyStyles as styles } from '@/css/CentroPage';
import type { TarjetaHorarioHoyProps } from '@/interfaces';

export function TarjetaHorarioHoy({ texto }: TarjetaHorarioHoyProps) {
  return (
    <TarjetaPastel tono="crema" style={styles.tarjeta}>
      <Text style={styles.texto}>
        <Text style={styles.titulo}>{TEXTOS_CENTRO.horarioHoy}: </Text>
        {texto}
      </Text>
    </TarjetaPastel>
  );
}
