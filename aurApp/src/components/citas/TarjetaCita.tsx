import { Text, View } from 'react-native';

import { AvatarMascota } from '@/components/ui/AvatarMascota';
import { Etiqueta } from '@/components/ui/Etiqueta';
import {
  COLORES,
  ETIQUETAS_ESTADO_CITA,
  MOTIVO_RECHAZO_SIN_DETALLE,
  TEXTO_ATENCION_INDEPENDIENTE,
  TEXTOS_CITAS,
} from '@/constants/constants';
import { tarjetaCitaStyles as styles } from '@/css/CitasPage';
import type { TarjetaCitaProps } from '@/interfaces';
import { formatFechaHoraCita } from '@/lib/fechas';

import { AccionesCita } from './AccionesCita';
import { BloqueFechaCita } from './BloqueFechaCita';

export function TarjetaCita({ cita, fotoMascota, variante, cancelando, onCancelar }: TarjetaCitaProps) {
  const colorEstado = COLORES.estados[cita.estado];
  const detallada = variante === 'detallada';
  const lugar = [cita.veterinario ?? TEXTOS_CITAS.sinVeterinario, cita.centro ?? TEXTO_ATENCION_INDEPENDIENTE].join(' · ');

  const estado = (
    <Etiqueta texto={ETIQUETAS_ESTADO_CITA[cita.estado]} colorFondo={colorEstado.fondo} colorTexto={colorEstado.texto} conPunto />
  );

  return (
    <View
      style={[
        styles.tarjeta,
        detallada && styles.detallada,
        !detallada && cita.estado === 'pendiente' && styles.pendiente,
      ]}>
      <View style={styles.fila}>
        {detallada && <BloqueFechaCita fechaHora={cita.fechaHora} />}

        <View style={styles.info}>
          {!detallada && (
            <View style={styles.cabecera}>
              <Text style={styles.fechaCompacta}>{formatFechaHoraCita(cita.fechaHora)}</Text>
              {estado}
            </View>
          )}
          <View style={styles.cabecera}>
            <Text style={styles.motivo} numberOfLines={2}>
              {cita.motivo}
            </Text>
            {detallada && estado}
          </View>
          <View style={styles.mascota}>
            <AvatarMascota nombre={cita.mascota} fotoUrl={fotoMascota} tamano={26} />
            <Text style={styles.nombreMascota}>{cita.mascota}</Text>
          </View>
          <Text style={styles.lugar} numberOfLines={2}>
            {lugar}
          </Text>
          {cita.rechazada && (
            <Text style={styles.rechazo}>
              {TEXTOS_CITAS.rechazo} {cita.motivoCancelacion ?? MOTIVO_RECHAZO_SIN_DETALLE}
            </Text>
          )}
        </View>
      </View>

      {(cita.puedeCancelar || (detallada && cita.direccion)) && (
        <View style={styles.pie}>
          <AccionesCita cita={cita} cancelando={cancelando} onCancelar={onCancelar} />
        </View>
      )}
    </View>
  );
}
