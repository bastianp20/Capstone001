import { View } from 'react-native';

import { ChipsOpcion } from '@/components/ui/ChipsOpcion';
import { FilaInterruptor } from '@/components/ui/FilaInterruptor';
import { TEXTOS_URGENCIAS as T } from '@/constants/constants';
import { useFiltrosUrgenciasStyles } from '@/css/UrgenciasPage';
import type { FiltrosUrgenciasProps } from '@/interfaces';

/** Comuna (chips que se envuelven) y dos interruptores: abiertos ahora y UCI con lugar. */
export function FiltrosUrgencias({ comunas, filtros, onCambiar }: FiltrosUrgenciasProps) {
  const styles = useFiltrosUrgenciasStyles();
  return (
    <View style={styles.contenedor}>
      {comunas.length > 1 && (
        <ChipsOpcion opciones={comunas.map((c) => ({ valor: c, texto: c }))} valor={filtros.comuna}
          onCambiar={(comuna) => onCambiar({ comuna })} permitirQuitar />
      )}
      <FilaInterruptor texto={T.soloAbiertos} valor={filtros.soloAbiertos} onCambiar={(soloAbiertos) => onCambiar({ soloAbiertos })} />
      <FilaInterruptor texto={T.soloUci} valor={filtros.soloUciDisponible} onCambiar={(soloUciDisponible) => onCambiar({ soloUciDisponible })} />
    </View>
  );
}
