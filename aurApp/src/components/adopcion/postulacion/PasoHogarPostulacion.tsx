import { View } from 'react-native';

import { PreguntaOpciones } from '@/components/ui/PreguntaOpciones';
import { PreguntaSiNo } from '@/components/ui/PreguntaSiNo';
import { OPCIONES_TENENCIA_ADOPCION, OPCIONES_VIVIENDA_ADOPCION, TEXTOS_POSTULACION as T } from '@/constants/constants';
import { postularAdopcionStyles as styles } from '@/css/PostularAdopcionPage';
import type { PasoPostulacionProps } from '@/interfaces';

/** Paso 1 · Tu hogar: dónde vive, patio, si es propia o arrendada (y si le permiten mascotas). */
export function PasoHogarPostulacion({ datos: d, errores: e, onCambiar }: PasoPostulacionProps) {
  return (
    <View style={styles.paso}>
      <PreguntaOpciones titulo={T.vivienda} opciones={OPCIONES_VIVIENDA_ADOPCION} valor={d.vivienda} onCambiar={(v) => onCambiar('vivienda', v)} error={e.vivienda} />
      <PreguntaSiNo titulo={T.patio} valor={d.tienePatio} onCambiar={(v) => onCambiar('tienePatio', v)} error={e.tienePatio} />
      <PreguntaOpciones titulo={T.tenencia} opciones={OPCIONES_TENENCIA_ADOPCION} valor={d.tenencia} onCambiar={(v) => onCambiar('tenencia', v)} error={e.tenencia} />
      {d.tenencia === 'arrendada' && (
        <PreguntaSiNo titulo={T.permitenMascotas} valor={d.permitenMascotas} onCambiar={(v) => onCambiar('permitenMascotas', v)} error={e.permitenMascotas} />
      )}
    </View>
  );
}
