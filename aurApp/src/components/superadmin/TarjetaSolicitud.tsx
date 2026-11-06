import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { CirculoIcono } from '@/components/ui/CirculoIcono';
import { ICONO_TIPO_SOLICITUD, TEXTOS_APROBACIONES as T, TIPO_SOLICITUD_LABEL } from '@/constants/constants';
import { useTarjetaSuperadminStyles } from '@/css/SuperadminPage';
import type { TarjetaSolicitudProps } from '@/interfaces';
import { diaDeCita, tiempoDesde } from '@/lib/fechas';
import { useColores } from '@/context/TemaContext';

/** Centro, veterinario, solicitud de centro o refugio esperando aprobación. */
export function TarjetaSolicitud({ solicitud: s, ocupado, onAprobar, onRechazar }: TarjetaSolicitudProps) {
  const COLORES = useColores();
  const styles = useTarjetaSuperadminStyles();
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
          {s.invitarA && <Text style={styles.detalle}>{T.sinCuenta(s.invitarA)}</Text>}
          <Text style={styles.fecha}>{T.solicitado(tiempoDesde(diaDeCita(s.creadoEn)))}</Text>
        </View>
      </View>
      <View style={styles.acciones}>
        <BotonPequeno texto={T.rechazar} variante="peligro" deshabilitado={ocupado} onPress={() => onRechazar(s)} />
        <BotonPequeno texto={s.invitarA ? T.aprobarInvitar : T.aprobar} variante="primario" cargando={ocupado} onPress={() => onAprobar(s)} />
      </View>
    </View>
  );
}
