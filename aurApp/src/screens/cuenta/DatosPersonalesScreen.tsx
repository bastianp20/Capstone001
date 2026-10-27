import { View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TEXTOS_DATOS_PERSONALES as T } from '@/constants/constants';
import { datosPersonalesStyles as styles } from '@/css/CuentaPage';
import { useDatosPersonales } from '@/hooks/useDatosPersonales';

export default function DatosPersonalesScreen() {
  const d = useDatosPersonales();

  return (
    <PantallaFormulario
      titulo={T.titulo}
      pie={<BotonPrincipal texto={T.guardar} textoCargando={T.guardando} cargando={d.guardando} onPress={d.guardar} />}>
      <View style={styles.formulario}>
        <CampoTexto
          etiqueta={T.nombre}
          icono="persona"
          value={d.nombre}
          onChangeText={d.cambiarNombre}
          autoCapitalize="words"
          autoComplete="name"
          maxLength={80}
        />
        <CampoTexto
          etiqueta={T.telefono}
          icono="telefono"
          value={d.telefono}
          onChangeText={d.cambiarTelefono}
          placeholder={T.telefonoPlaceholder}
          keyboardType="phone-pad"
          autoComplete="tel"
          maxLength={16}
        />
        <CampoTexto etiqueta={T.correo} icono="correo" value={d.correo} editable={false} ayuda={T.correoAyuda} />
        <MensajeFormulario tipo="aviso" texto={d.aviso} />
        <MensajeFormulario tipo="error" texto={d.error} />
      </View>
    </PantallaFormulario>
  );
}
