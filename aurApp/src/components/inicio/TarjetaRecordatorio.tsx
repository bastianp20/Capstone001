import { Text, View } from 'react-native';

import { CirculoIcono } from '@/components/ui/CirculoIcono';
import { TarjetaPastel } from '@/components/ui/TarjetaPastel';
import { COLORES, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaRecordatorioStyles as styles } from '@/css/InicioPage';
import type { TarjetaRecordatorioProps } from '@/interfaces';

export function TarjetaRecordatorio({ recordatorio, onPress }: TarjetaRecordatorioProps) {
  const tono = TONOS_TARJETA[recordatorio.tono];
  const colorDetalle = { al_dia: COLORES.textoSecundario, pronto: tono.icono, vencido: COLORES.error }[recordatorio.estado];

  return (
    <TarjetaPastel tono={recordatorio.tono} onPress={onPress && (() => onPress(recordatorio))} style={styles.tarjeta}>
      <CirculoIcono icono={recordatorio.icono} tamano={36} tamanoIcono={18} colorIcono={tono.icono} colorFondo={tono.iconoFondo} grosor={2.1} />
      <View style={styles.textos}>
        <Text style={styles.titulo} numberOfLines={1}>
          {recordatorio.titulo}
        </Text>
        <Text style={[styles.detalle, { color: colorDetalle }]} numberOfLines={1}>
          {recordatorio.detalle}
        </Text>
      </View>
    </TarjetaPastel>
  );
}
