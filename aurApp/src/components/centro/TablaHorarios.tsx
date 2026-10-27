import { Text, View } from 'react-native';

import { DIAS_SEMANA_LARGOS, TEXTOS_MI_CENTRO } from '@/constants/constants';
import { tablaHorariosStyles as styles } from '@/css/CentroPage';
import type { TablaHorariosProps } from '@/interfaces';

const DIAS = [1, 2, 3, 4, 5, 6, 7];

/** Lunes a domingo con su horario; los días sin fila aparecen como cerrados. */
export function TablaHorarios({ horarios }: TablaHorariosProps) {
  return (
    <View style={styles.tarjeta}>
      {DIAS.map((dia, i) => {
        const h = horarios.find((x) => x.diaSemana === dia);
        return (
          <View key={dia} style={[styles.fila, i < DIAS.length - 1 && styles.separador]}>
            <Text style={styles.dia}>{DIAS_SEMANA_LARGOS[dia]}</Text>
            <View style={styles.horas}>
              <Text style={[styles.hora, !h && styles.cerrado]}>{h ? `${h.abre} – ${h.cierra}` : TEXTOS_MI_CENTRO.cerrado}</Text>
              {h?.inicioColacion && (
                <Text style={styles.colacion}>
                  Colación {h.inicioColacion} – {h.finColacion}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
