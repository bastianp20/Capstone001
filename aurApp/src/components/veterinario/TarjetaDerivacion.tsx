import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { TarjetaPastel } from '@/components/ui/TarjetaPastel';
import { ESTADO_DERIVACION_LABEL, TEXTOS_DERIVACIONES as T, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaDerivacionStyles as styles } from '@/css/VeterinarioPage';
import type { TarjetaDerivacionProps } from '@/interfaces';
import { formatFechaCorta } from '@/lib/fechas';

export function TarjetaDerivacion({ derivacion: d, ocupado, onRealizada, onRechazar }: TarjetaDerivacionProps) {
  const tono = d.recibida ? 'lavanda' : 'crema';
  const colores = TONOS_TARJETA[tono];
  const pendiente = d.estado === 'pendiente';

  return (
    <TarjetaPastel tono={tono} style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <Text style={styles.mascota}>
          {d.mascota} <Text style={styles.dueno}>· {d.dueno}</Text>
        </Text>
        <Etiqueta texto={ESTADO_DERIVACION_LABEL[d.estado]} colorFondo={colores.iconoFondo} colorTexto={colores.icono} />
      </View>
      <Text style={styles.detalle}>
        {formatFechaCorta(d.fecha)} · {d.recibida ? T.de(d.origen ?? '—') : T.a(d.destino ?? '—')}
      </Text>
      <Text style={styles.motivo}>{d.motivo}</Text>
      {d.resultado && <Text style={styles.detalle}>{d.resultado}</Text>}
      {pendiente && (
        <View style={styles.acciones}>
          <BotonPequeno texto={d.recibida ? T.rechazar : T.cancelar} variante="peligro" cargando={ocupado} onPress={() => onRechazar(d)} />
          {d.recibida && <BotonPequeno texto={T.realizada} variante="primario" icono="completar" onPress={() => onRealizada(d)} />}
        </View>
      )}
    </TarjetaPastel>
  );
}
