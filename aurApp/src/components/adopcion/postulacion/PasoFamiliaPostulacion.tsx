import { View } from 'react-native';

import { CampoTexto } from '@/components/formulario/CampoTexto';
import { PreguntaSiNo } from '@/components/ui/PreguntaSiNo';
import { TEXTOS_POSTULACION as T } from '@/constants/constants';
import { usePostularAdopcionStyles } from '@/css/PostularAdopcionPage';
import type { PasoPostulacionProps } from '@/interfaces';

/** Paso 2 · Tu familia: niños, otras mascotas y si todos están de acuerdo. */
export function PasoFamiliaPostulacion({ datos: d, errores: e, onCambiar }: PasoPostulacionProps) {
  const styles = usePostularAdopcionStyles();
  return (
    <View style={styles.paso}>
      <PreguntaSiNo titulo={T.hayNinos} valor={d.hayNinos} onCambiar={(v) => onCambiar('hayNinos', v)} error={e.hayNinos} />
      {d.hayNinos && (
        <CampoTexto
          etiqueta={T.edadesNinos}
          icono="persona"
          value={d.edadesNinos}
          onChangeText={(v) => onCambiar('edadesNinos', v)}
          placeholder={T.edadesPlaceholder}
          error={e.edadesNinos}
          maxLength={80}
        />
      )}
      <PreguntaSiNo titulo={T.otrasMascotas} valor={d.otrasMascotas} onCambiar={(v) => onCambiar('otrasMascotas', v)} error={e.otrasMascotas} />
      {d.otrasMascotas && (
        <CampoTexto
          etiqueta={T.cualesMascotas}
          icono="huella"
          value={d.cualesMascotas}
          onChangeText={(v) => onCambiar('cualesMascotas', v)}
          placeholder={T.cualesPlaceholder}
          error={e.cualesMascotas}
          maxLength={120}
        />
      )}
      <PreguntaSiNo titulo={T.todosDeAcuerdo} valor={d.todosDeAcuerdo} onCambiar={(v) => onCambiar('todosDeAcuerdo', v)} error={e.todosDeAcuerdo} />
    </View>
  );
}
