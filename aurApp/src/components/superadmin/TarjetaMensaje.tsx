import { useState } from 'react';
import { Text, View } from 'react-native';

import { EnlaceTexto } from '@/components/formulario/EnlaceTexto';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { COLORES, TEXTOS_MENSAJES as T } from '@/constants/constants';
import { tarjetaSuperadminStyles as styles } from '@/css/SuperadminPage';
import type { TarjetaMensajeProps } from '@/interfaces';
import { formatFechaHoraCita } from '@/lib/fechas';

/** Mensaje del formulario de contacto: se despliega para leerlo y responderlo. */
export function TarjetaMensaje({ mensaje: m, ocupado, onResponder, onCambiarEstado }: TarjetaMensajeProps) {
  const [abierto, setAbierto] = useState(false);
  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <View style={styles.textos}>
          <Text style={styles.titulo} numberOfLines={1}>
            {m.nombre}
          </Text>
          <Text style={styles.detalle} numberOfLines={1}>
            {m.correo}
          </Text>
        </View>
        <Etiqueta texto={m.asunto} colorFondo={COLORES.primarioSuave} colorTexto={COLORES.primarioOscuro} />
      </View>
      <Text style={styles.fecha}>{formatFechaHoraCita(m.creadoEn)}</Text>
      <Text style={styles.cuerpo} numberOfLines={abierto ? undefined : 2}>
        {m.mensaje}
      </Text>
      <EnlaceTexto texto={abierto ? T.verMenos : T.verMas} onPress={() => setAbierto((v) => !v)} />
      <View style={styles.acciones}>
        {m.estado === 'pendiente' && (
          <>
            <BotonPequeno texto={T.marcarRespondido} cargando={ocupado} onPress={() => onCambiarEstado(m, 'respondido')} />
            <BotonPequeno texto={T.responder} icono="correo" variante="primario" onPress={() => onResponder(m)} />
          </>
        )}
        {m.estado === 'respondido' && <BotonPequeno texto={T.cerrar} cargando={ocupado} onPress={() => onCambiarEstado(m, 'cerrado')} />}
        {m.estado === 'cerrado' && <BotonPequeno texto={T.reabrir} cargando={ocupado} onPress={() => onCambiarEstado(m, 'pendiente')} />}
      </View>
    </View>
  );
}
