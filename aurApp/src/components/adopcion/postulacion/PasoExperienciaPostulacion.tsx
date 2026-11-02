import { View } from 'react-native';

import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MAX_TEXTO_POSTULACION, TEXTOS_POSTULACION as T } from '@/constants/constants';
import { postularAdopcionStyles as styles } from '@/css/PostularAdopcionPage';
import type { PasoPostulacionProps } from '@/interfaces';

/** Paso 3 · Experiencia: mascotas que ha tenido (opcional) y por qué quiere adoptar. */
export function PasoExperienciaPostulacion({ datos: d, errores: e, onCambiar }: PasoPostulacionProps) {
  return (
    <View style={styles.paso}>
      <CampoTexto
        etiqueta={T.experiencia}
        icono="historial"
        value={d.experiencia}
        onChangeText={(v) => onCambiar('experiencia', v)}
        placeholder={T.experienciaPlaceholder}
        multiline
        maxLength={MAX_TEXTO_POSTULACION}
      />
      <CampoTexto
        etiqueta={T.motivo}
        icono="corazon"
        value={d.motivo}
        onChangeText={(v) => onCambiar('motivo', v)}
        placeholder={T.motivoPlaceholder}
        multiline
        maxLength={MAX_TEXTO_POSTULACION}
        error={e.motivo}
      />
    </View>
  );
}
