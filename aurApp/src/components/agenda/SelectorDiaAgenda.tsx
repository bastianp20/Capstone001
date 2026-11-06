import { Pressable, Text, View } from 'react-native';

import { useAgendaSemanaStyles } from '@/css/MiAgendaPage';
import type { SelectorDiaAgendaProps } from '@/interfaces';

/** Los 7 días de la semana en una fila (sin scroll horizontal); el punto marca los días con citas. */
export function SelectorDiaAgenda({ dias, elegido, onElegir }: SelectorDiaAgendaProps) {
  const styles = useAgendaSemanaStyles();
  return (
    <View style={styles.dias}>
      {dias.map((d) => {
        const activo = d.fecha === elegido;
        return (
          <Pressable key={d.fecha} onPress={() => onElegir(d.fecha)} accessibilityRole="button"
            accessibilityState={{ selected: activo }} accessibilityLabel={`${d.diaCorto} ${d.numero}, ${d.conCitas} citas`}
            style={[styles.dia, d.esHoy && styles.diaHoy, activo && styles.diaElegido]}>
            <Text style={[styles.diaCorto, activo && styles.textoElegido]}>{d.diaCorto}</Text>
            <Text style={[styles.diaNumero, activo && styles.textoElegido]}>{d.numero}</Text>
            <View style={[styles.punto, (!d.conCitas || activo) && styles.puntoVacio]} />
          </Pressable>
        );
      })}
    </View>
  );
}
