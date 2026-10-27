import { View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TEXTOS_EDITAR_CENTRO as T } from '@/constants/constants';
import { editarCentroStyles as styles } from '@/css/CentroPage';
import { useEditarCentro } from '@/hooks/useEditarCentro';

export default function EditarCentroScreen() {
  const e = useEditarCentro();
  return (
    <PantallaFormulario titulo={T.titulo} pie={<BotonPrincipal texto={T.guardar} textoCargando={T.guardando} cargando={e.guardando} onPress={e.guardar} />}>
      <View style={styles.formulario}>
        <CampoTexto etiqueta={T.nombre} icono="centro" value={e.form.nombre} onChangeText={(v) => e.cambiar('nombre', v)} maxLength={80} />
        <CampoTexto etiqueta={T.direccion} icono="ubicacion" value={e.form.direccion} onChangeText={(v) => e.cambiar('direccion', v)} maxLength={120} />
        <CampoTexto etiqueta={T.comuna} icono="ubicacion" value={e.form.comuna} onChangeText={(v) => e.cambiar('comuna', v)} maxLength={60} />
        <CampoTexto
          etiqueta={T.telefono}
          icono="telefono"
          value={e.form.telefono}
          onChangeText={(v) => e.cambiar('telefono', v)}
          keyboardType="phone-pad"
          maxLength={16}
        />
        <MensajeFormulario tipo="error" texto={e.error} />
      </View>
    </PantallaFormulario>
  );
}
