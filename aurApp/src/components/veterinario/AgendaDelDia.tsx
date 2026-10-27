import { Pressable, Text, View } from 'react-native';

import { Etiqueta } from '@/components/ui/Etiqueta';
import { COLORES, ETIQUETAS_ESTADO_CITA } from '@/constants/constants';
import { agendaDelDiaStyles as styles } from '@/css/VeterinarioPage';
import type { AgendaDelDiaProps } from '@/interfaces';
import { partesFechaCita } from '@/lib/fechas';

/** Las citas del día como línea de tiempo: hora a la izquierda y una tarjeta chica por cita. */
export function AgendaDelDia({ citas, onAbrir }: AgendaDelDiaProps) {
  return (
    <View style={styles.contenedor}>
      {citas.map((c, i) => {
        const color = COLORES.estados[c.estado];
        return (
          <View key={c.id} style={styles.fila}>
            <Text style={styles.hora}>{partesFechaCita(c.fechaHora).hora}</Text>
            <View style={styles.guia}>
              <View style={[styles.punto, { backgroundColor: color.texto }]} />
              {i < citas.length - 1 && <View style={styles.linea} />}
            </View>
            <Pressable onPress={() => onAbrir(c)} style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}>
              <View style={styles.textos}>
                <Text style={styles.motivo} numberOfLines={1}>
                  {c.mascota} · {c.motivo}
                </Text>
                <Text style={styles.dueno} numberOfLines={1}>
                  {c.dueno}
                </Text>
              </View>
              <Etiqueta texto={ETIQUETAS_ESTADO_CITA[c.estado]} colorFondo={color.fondo} colorTexto={color.texto} />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
