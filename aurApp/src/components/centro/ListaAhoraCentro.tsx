import { Text, View } from 'react-native';

import { Etiqueta } from '@/components/ui/Etiqueta';
import { COLORES, ETIQUETAS_ESTADO_CITA, TEXTOS_CENTRO as T } from '@/constants/constants';
import { listaAhoraCentroStyles as styles } from '@/css/CentroPage';
import type { ListaAhoraCentroProps } from '@/interfaces';
import { diaDeCita, formatFechaHoraCita, hoy, partesFechaCita } from '@/lib/fechas';

/** Próximas citas del centro en una tarjeta: hora, mascota, veterinario y estado. */
export function ListaAhoraCentro({ citas }: ListaAhoraCentroProps) {
  return (
    <View style={styles.tarjeta}>
      {citas.map((c, i) => {
        const color = COLORES.estados[c.estado];
        const cuando = diaDeCita(c.fechaHora) === hoy() ? partesFechaCita(c.fechaHora).hora : formatFechaHoraCita(c.fechaHora);
        return (
          <View key={c.id} style={[styles.fila, i < citas.length - 1 && styles.separador]}>
            <Text style={styles.hora}>{cuando}</Text>
            <View style={styles.textos}>
              <Text style={styles.mascota} numberOfLines={1}>
                {c.mascota} <Text style={styles.motivo}>· {c.motivo}</Text>
              </Text>
              <Text style={styles.detalle} numberOfLines={1}>
                {c.veterinario ?? c.dueno}
              </Text>
              <View style={styles.etiquetas}>
                {c.veterinario === null ? (
                  <Etiqueta texto={T.sinVeterinario} icono="alerta" colorFondo={COLORES.estados.pendiente.fondo} colorTexto={COLORES.estados.pendiente.texto} />
                ) : (
                  <Etiqueta texto={ETIQUETAS_ESTADO_CITA[c.estado]} colorFondo={color.fondo} colorTexto={color.texto} conPunto />
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
