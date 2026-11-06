import { Text, View } from 'react-native';

import { BotonIcono } from '@/components/ui/BotonIcono';
import { TEXTOS_MI_AGENDA as T } from '@/constants/constants';
import { useAgendaSemanaStyles } from '@/css/MiAgendaPage';
import type { NavegacionSemanaProps } from '@/interfaces';

/** ‹ Noviembre 2026 › */
export function NavegacionSemana({ titulo, onAnterior, onSiguiente }: NavegacionSemanaProps) {
  const styles = useAgendaSemanaStyles();
  return (
    <View style={styles.navegacion}>
      <BotonIcono icono="atras" etiqueta={T.semanaAnterior} onPress={onAnterior} />
      <Text style={styles.mes}>{titulo}</Text>
      <BotonIcono icono="chevronDerecha" etiqueta={T.semanaSiguiente} onPress={onSiguiente} />
    </View>
  );
}
