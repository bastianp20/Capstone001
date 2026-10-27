import { Pressable, Text } from 'react-native';

import { Etiqueta } from '@/components/ui/Etiqueta';
import { COLORES, ETIQUETAS_ESTADO_CITA, TEXTO_ATENCION_INDEPENDIENTE, TEXTOS_INICIO } from '@/constants/constants';
import { tarjetaProximaCitaStyles as styles } from '@/css/InicioPage';
import type { TarjetaProximaCitaProps } from '@/interfaces';
import { formatFechaHoraCita } from '@/lib/fechas';

export function TarjetaProximaCita({ cita, onPress, style }: TarjetaProximaCitaProps) {
  const colorEstado = cita ? COLORES.estados[cita.estado] : null;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tarjeta, style, pressed && styles.presionada]}>
      <Text style={styles.titulo}>{TEXTOS_INICIO.proximaCita}</Text>
      {cita && colorEstado ? (
        <>
          <Etiqueta texto={formatFechaHoraCita(cita.fechaHora)} icono="citas" colorFondo={COLORES.primarioSuave} colorTexto={COLORES.primarioOscuro} />
          <Text style={styles.motivo} numberOfLines={1}>
            {cita.motivo}
          </Text>
          <Text style={styles.detalle} numberOfLines={2}>
            {[cita.veterinario, cita.centro ?? TEXTO_ATENCION_INDEPENDIENTE].filter(Boolean).join(' · ')}
          </Text>
          <Etiqueta texto={ETIQUETAS_ESTADO_CITA[cita.estado]} colorFondo={colorEstado.fondo} colorTexto={colorEstado.texto} conPunto />
        </>
      ) : (
        <>
          <Text style={styles.motivo}>{TEXTOS_INICIO.sinCita}</Text>
          <Text style={styles.detalle}>{TEXTOS_INICIO.sinCitaDetalle}</Text>
        </>
      )}
    </Pressable>
  );
}
