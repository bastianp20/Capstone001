import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { COLORES, ESTADO_ELIMINACION_LABEL, TEXTOS_ELIMINACIONES as T } from '@/constants/constants';
import { tarjetaSuperadminStyles as styles } from '@/css/SuperadminPage';
import type { TarjetaEliminacionProps } from '@/interfaces';
import { formatFechaHoraCita } from '@/lib/fechas';
import { capitalizar } from '@/lib/texto';

const COLOR = { pendiente: COLORES.estados.pendiente, aprobada: COLORES.estados.completada, rechazada: COLORES.estados.cancelada } as const;

export function TarjetaEliminacion({ solicitud: e, ocupado, onAprobar, onRechazar }: TarjetaEliminacionProps) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <View style={styles.textos}>
          <Text style={styles.titulo}>{e.nombre}</Text>
          <Text style={styles.detalle}>
            {e.correo} · {capitalizar(e.rol)}
          </Text>
        </View>
        <Etiqueta texto={ESTADO_ELIMINACION_LABEL[e.estado]} colorFondo={COLOR[e.estado].fondo} colorTexto={COLOR[e.estado].texto} conPunto />
      </View>
      <Text style={styles.fecha}>{formatFechaHoraCita(e.creadaEn)}</Text>
      <Text style={styles.cuerpo}>{e.motivo || T.sinMotivo}</Text>
      {e.respuesta && <Text style={styles.detalle}>{e.respuesta}</Text>}
      {e.estado === 'pendiente' && (
        <View style={styles.acciones}>
          <BotonPequeno texto={T.rechazar} deshabilitado={ocupado} onPress={() => onRechazar(e)} />
          <BotonPequeno texto={T.aprobar} variante="peligro" cargando={ocupado} onPress={() => onAprobar(e)} />
        </View>
      )}
    </View>
  );
}
