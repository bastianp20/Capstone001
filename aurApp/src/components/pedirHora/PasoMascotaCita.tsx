import { View } from 'react-native';

import { CampoTexto } from '@/components/formulario/CampoTexto';
import { ChipsMultiples } from '@/components/ui/ChipsMultiples';
import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { SINTOMAS_FRECUENTES, TEXTOS_PEDIR_HORA as T } from '@/constants/constants';
import { usePasosPedirHoraStyles } from '@/css/PedirHoraPage';
import type { PasoMascotaCitaProps } from '@/interfaces';

/** Paso 1: para quién es la hora, el motivo y los síntomas. */
export function PasoMascotaCita({ mascotas, mascotaId, onMascota, motivo, onMotivo, sintomas, onSintoma }: PasoMascotaCitaProps) {
  const styles = usePasosPedirHoraStyles();
  return (
    <View style={styles.paso}>
      <GrupoCampo titulo={T.mascota}>
        <SelectorPildoras
          opciones={mascotas.map((m) => ({ valor: String(m.id), texto: m.nombre }))}
          seleccionado={mascotaId === null ? '' : String(mascotaId)}
          onSeleccionar={(id) => onMascota(Number(id))}
        />
      </GrupoCampo>
      <CampoTexto etiqueta={T.motivo} icono="estetoscopio" value={motivo} onChangeText={onMotivo} placeholder={T.motivoPlaceholder} multiline maxLength={300} />
      <GrupoCampo titulo={T.sintomas}>
        <ChipsMultiples opciones={SINTOMAS_FRECUENTES} seleccionadas={sintomas} onAlternar={onSintoma} />
      </GrupoCampo>
    </View>
  );
}
