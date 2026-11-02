import { Text, View } from 'react-native';

import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { TEXTOS_PEDIR_HORA as T } from '@/constants/constants';
import { pasosPedirHoraStyles as styles } from '@/css/PedirHoraPage';
import type { PasoDiaHoraCitaProps } from '@/interfaces';

import { GrillaDias } from './GrillaDias';
import { GrillaHoras } from './GrillaHoras';

/** Paso 3: con quién (si es un centro), el día y la hora. */
export function PasoDiaHoraCita(p: PasoDiaHoraCitaProps) {
  return (
    <View style={styles.paso}>
      <Text style={styles.lugar}>{T.dondeAtender(p.lugar)}</Text>
      {p.opcionesVeterinario.length > 0 && (
        <GrupoCampo titulo={T.veterinario} ayuda={p.ayudaVeterinario}>
          <SelectorPildoras opciones={p.opcionesVeterinario} seleccionado={p.veterinario} onSeleccionar={p.onVeterinario} />
        </GrupoCampo>
      )}
      <GrupoCampo titulo={T.dia} ayuda={p.ayudaDia}>
        <GrillaDias dias={p.dias} seleccionado={p.fecha} onElegir={p.onFecha} />
      </GrupoCampo>
      {p.fecha && (
        <GrupoCampo titulo={T.hora} ayuda={p.horas.length === 0 ? T.sinHoras : undefined}>
          <GrillaHoras horas={p.horas} seleccionada={p.hora} onElegir={p.onHora} />
        </GrupoCampo>
      )}
    </View>
  );
}
