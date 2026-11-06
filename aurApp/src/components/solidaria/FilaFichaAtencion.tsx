import { Switch, Text, View } from 'react-native';

import { TEXTOS_ATENCION_SOLIDARIA as T } from '@/constants/constants';
import { useFilaFichaAtencionStyles } from '@/css/SolidariaPage';
import type { FilaFichaAtencionProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Una fila de "Su ficha" (vacunas, esterilización…). Lo que ya estaba en su ficha queda marcado y fijo. */
export function FilaFichaAtencion({ texto, yaEnFicha, marcado, onCambiar }: FilaFichaAtencionProps) {
  const COLORES = useColores();
  const styles = useFilaFichaAtencionStyles();
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
