import { View } from 'react-native';

import { CampoTexto } from '@/components/formulario/CampoTexto';
import { ChipsMultiples } from '@/components/ui/ChipsMultiples';
import { GrupoCampo } from '@/components/ui/GrupoCampo';
import {
  ETIQUETAS_RASGOS_ADOPCION,
  OPCIONES_PERSONALIDAD_ADOPCION,
  RASGOS_ADOPCION,
  TEXTOS_PUBLICAR as T,
} from '@/constants/constants';
import { usePublicarAdopcionStyles } from '@/css/PublicarAdopcionPage';
import type { PasoPersonalidadPublicarProps } from '@/interfaces';

import { SelectorNivel } from './SelectorNivel';

/** Paso 2 · Personalidad: hasta 5 rasgos, cómo es (1 a 5) y una frase en primera persona. */
export function PasoPersonalidadPublicar({ datos: d, errores: e, onCambiar, onAlternarPersonalidad }: PasoPersonalidadPublicarProps) {
  const styles = usePublicarAdopcionStyles();
  return (
    <View style={styles.paso}>
      <GrupoCampo titulo={T.personalidad} error={e.personalidad}>
        <ChipsMultiples opciones={OPCIONES_PERSONALIDAD_ADOPCION} seleccionadas={d.personalidad} onAlternar={onAlternarPersonalidad} />
      </GrupoCampo>
      <GrupoCampo titulo={T.rasgos}>
        <View style={styles.rasgos}>
          {RASGOS_ADOPCION.map((rasgo) => (
            <SelectorNivel
              key={rasgo}
              titulo={ETIQUETAS_RASGOS_ADOPCION[rasgo]}
              valor={d.rasgos[rasgo]}
              onCambiar={(nivel) => onCambiar('rasgos', { ...d.rasgos, [rasgo]: nivel })}
            />
          ))}
        </View>
      </GrupoCampo>
      <CampoTexto etiqueta={T.frase} icono="mensaje" value={d.frase} onChangeText={(v) => onCambiar('frase', v)} placeholder={T.frasePlaceholder} maxLength={140} />
    </View>
  );
}
