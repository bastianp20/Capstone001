import { View } from 'react-native';

import { Casilla } from '@/components/ui/Casilla';
import { CampoHora } from '@/components/ui/CampoHora';
import { TEXTOS_HORARIO_CENTRO as T } from '@/constants/constants';
import { useHorarioCentroStyles } from '@/css/UrgenciasCentroPage';
import type { FilaDiaHorarioCentroProps } from '@/interfaces';

/** Un día del horario del centro: si atiende, abre/cierra y la colación. */
export function FilaDiaHorarioCentro({ dia, onCambiar }: FilaDiaHorarioCentroProps) {
  const styles = useHorarioCentroStyles();
  return (
    <View style={styles.dia}>
      <Casilla texto={dia.nombre} marcada={dia.atiende} onCambiar={(atiende) => onCambiar({ atiende })} />
      {dia.atiende && (
        <>
          <View style={styles.fila}>
            <View style={styles.mitad}><CampoHora etiqueta={T.abre} valor={dia.abre} onCambiar={(abre) => onCambiar({ abre })} /></View>
            <View style={styles.mitad}><CampoHora etiqueta={T.cierra} valor={dia.cierra} onCambiar={(cierra) => onCambiar({ cierra })} /></View>
          </View>
          <Casilla texto={T.colacion} marcada={dia.conColacion} onCambiar={(conColacion) => onCambiar({ conColacion })} />
          {dia.conColacion && (
            <View style={styles.fila}>
              <View style={styles.mitad}>
                <CampoHora etiqueta={T.inicioColacion} valor={dia.inicioColacion} onCambiar={(inicioColacion) => onCambiar({ inicioColacion })} />
              </View>
              <View style={styles.mitad}>
                <CampoHora etiqueta={T.finColacion} valor={dia.finColacion} onCambiar={(finColacion) => onCambiar({ finColacion })} />
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}
