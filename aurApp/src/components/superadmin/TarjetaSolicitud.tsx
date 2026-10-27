import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { CirculoIcono } from '@/components/ui/CirculoIcono';
import { COLORES, ICONO_TIPO_SOLICITUD, TEXTOS_APROBACIONES as T, TIPO_SOLICITUD_LABEL } from '@/constants/constants';
import { tarjetaSuperadminStyles as styles } from '@/css/SuperadminPage';
import type { TarjetaSolicitudProps } from '@/interfaces';
import { diaDeCita, tiempoDesde } from '@/lib/fechas';

/** Centro, veterinario o solicitud de centro esperando aprobación. */
export function TarjetaSolicitud({ solicitud: s, ocupado, onAprobar, onRechazar }: TarjetaSolicitudProps) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <CirculoIcono icono={ICONO_TIPO_SOLICITUD[s.tipo]} tamano={40} tamanoIcono={19} colorIcono={COLORES.primario} colorFondo={COLORES.primarioSuave} />
        <View style={styles.textos}>
          <Text style={styles.titulo} numberOfLines={2}>
            {s.nombre}
          </Text>
          <Text style={styles.detalle} numberOfLines={2}>
            {[TIPO_SOLICITUD_LABEL[s.tipo], s.detalle].filter(Boolean).join(' · ')}
          </Text>
          <Text style={styles.fecha}>{T.solicitado(tiempoDesde(diaDeCita(s.creadoEn)))}</Text>
        </View>
      </View>
      <View style={styles.acciones}>
        <BotonPequeno texto={T.rechazar} variante="peligro" deshabilitado={ocupado} onPress={() => onRechazar(s)} />
        <BotonPequeno texto={T.aprobar} variante="primario" cargando={ocupado} onPress={() => onAprobar(s)} />
      </View>
    </View>
  );
}
