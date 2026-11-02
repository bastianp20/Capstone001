import { Switch, Text, View } from 'react-native';

import { COLORES, TEXTOS_ATENCION_SOLIDARIA as T } from '@/constants/constants';
import { filaFichaAtencionStyles as styles } from '@/css/SolidariaPage';
import type { FilaFichaAtencionProps } from '@/interfaces';

/** Una fila de "Su ficha" (vacunas, esterilización…). Lo que ya estaba en su ficha queda marcado y fijo. */
export function FilaFichaAtencion({ texto, yaEnFicha, marcado, onCambiar }: FilaFichaAtencionProps) {
  return (
    <View style={styles.fila}>
      <View style={styles.textos}>
        <Text style={styles.texto}>{texto}</Text>
        {yaEnFicha && <Text style={styles.yaEnFicha}>{T.yaEnFicha}</Text>}
      </View>
      <Switch
        value={yaEnFicha || marcado}
        onValueChange={onCambiar}
        disabled={yaEnFicha}
        trackColor={{ false: COLORES.bordeCampo, true: COLORES.primario }}
        thumbColor={COLORES.blanco}
        accessibilityLabel={texto}
      />
    </View>
  );
}
