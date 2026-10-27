import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { TEXTOS_SOLICITUDES_PLAN as T } from '@/constants/constants';
import { tarjetaSuperadminStyles as styles } from '@/css/SuperadminPage';
import type { TarjetaSolicitudPlanProps } from '@/interfaces';
import { formatFechaHoraCita } from '@/lib/fechas';

export function TarjetaSolicitudPlan({ solicitud: s, ocupado, onActivar, onRechazar }: TarjetaSolicitudPlanProps) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.textos}>
        <Text style={styles.titulo}>
          {s.centro} <Text style={styles.detalle}>· {s.comuna}</Text>
        </Text>
        <Text style={styles.cuerpo}>{T.cambio(s.planActual, s.planSolicitado)}</Text>
        {s.solicitadoPor && (
          <Text style={styles.detalle}>
            {T.pedidoPor(s.solicitadoPor)}
            {s.solicitadoEn ? ` · ${formatFechaHoraCita(s.solicitadoEn)}` : ''}
          </Text>
        )}
        {s.mensaje && <Text style={styles.detalle}>“{s.mensaje}”</Text>}
      </View>
      <View style={styles.acciones}>
        <BotonPequeno texto={T.rechazar} variante="peligro" deshabilitado={ocupado} onPress={() => onRechazar(s)} />
        <BotonPequeno texto={T.activar} variante="primario" cargando={ocupado} onPress={() => onActivar(s)} />
      </View>
    </View>
  );
}
