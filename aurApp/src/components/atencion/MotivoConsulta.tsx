import { Text, View } from 'react-native';

import { TEXTOS_ATENCION as T } from '@/constants/constants';
import { motivoConsultaStyles as styles } from '@/css/AtencionPage';
import type { MotivoConsultaProps } from '@/interfaces';

/** Lo que contó el dueño al pedir la hora, con los síntomas que marcó. */
export function MotivoConsulta({ motivo, sintomas }: MotivoConsultaProps) {
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.etiqueta}>{T.motivo}</Text>
      <Text style={styles.motivo}>{motivo}</Text>
      {sintomas.length > 0 && (
        <View style={styles.chips}>
          {sintomas.map((s) => (
            <Text key={s} style={styles.chip}>
              {s}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
