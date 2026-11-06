import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { CampoHora } from '@/components/ui/CampoHora';
import { Casilla } from '@/components/ui/Casilla';
import { DIAS_SEMANA_LARGOS, TEXTOS_HORARIO_ATENCION as T } from '@/constants/constants';
import { useDiasLugarStyles, useHorarioAtencionStyles } from '@/css/HorarioAtencionPage';
import type { DiasLugarHorarioProps } from '@/interfaces';
import { esDiaCompleto } from '@/lib/horarioCentro';

/** Los 7 días de un lugar (un centro o la atención independiente): cada día se marca y lleva desde-hasta. */
export function DiasLugarHorario({ lugar, dias, onCambiarDia, onUsarHorarioCentro }: DiasLugarHorarioProps) {
  const base = useHorarioAtencionStyles();
  const styles = useDiasLugarStyles();
  const conCentro = lugar.horarioCentro.length > 0;
  return (
    <View style={base.tarjeta}>
      <Text style={base.tarjetaTitulo}>{lugar.nombre ?? T.independiente}</Text>
      {conCentro && <BotonPequeno texto={T.usarHorarioCentro} icono="reloj" onPress={onUsarHorarioCentro} />}
      {dias.map((d, i) => {
        const delCentro = lugar.horarioCentro.find((h) => h.diaSemana === i + 1);
        return (
          <View key={DIAS_SEMANA_LARGOS[i + 1]} style={[styles.dia, i === 0 && styles.primerDia]}>
            <Casilla texto={DIAS_SEMANA_LARGOS[i + 1]} marcada={d.activo} onCambiar={(activo) => onCambiarDia(i, { activo })} />
            {d.activo && (
              <View style={styles.horas}>
                <CampoHora etiqueta={T.desde} valor={d.desde} onCambiar={(desde) => onCambiarDia(i, { desde })} />
                <CampoHora etiqueta={T.hasta} valor={d.hasta} onCambiar={(hasta) => onCambiarDia(i, { hasta })} />
              </View>
            )}
            {conCentro && (
              <Text style={styles.notaCentro}>
                {!delCentro ? T.centroCerrado : esDiaCompleto(delCentro) ? T.centro24h : T.centroAtiende(delCentro.abre, delCentro.cierra)}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
