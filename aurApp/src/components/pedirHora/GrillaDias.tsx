import { Pressable, Text, View } from 'react-native';

import { grillaDiasStyles as styles } from '@/css/PedirHoraPage';
import type { GrillaDiasProps } from '@/interfaces';

/** Días disponibles en grilla (sin scroll horizontal, que en Android daba problemas). */
export function GrillaDias({ dias, seleccionado, onElegir }: GrillaDiasProps) {
  return (
    <View style={styles.grilla}>
      {dias.map((d) => {
        const activo = d.fecha === seleccionado;
        return (
          <Pressable
            key={d.fecha}
            onPress={() => onElegir(d.fecha)}
            accessibilityRole="radio"
            accessibilityState={{ selected: activo }}
            accessibilityLabel={`${d.diaSemana} ${d.numero} ${d.mes}`}
            style={[styles.dia, activo && styles.diaActivo]}>
            <Text style={[styles.diaSemana, activo && styles.textoActivo]}>{d.diaSemana}</Text>
            <Text style={[styles.numero, activo && styles.textoActivo]}>{d.numero}</Text>
            <Text style={[styles.mes, activo && styles.textoActivo]}>{d.mes}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
