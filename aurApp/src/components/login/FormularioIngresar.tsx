import { View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoPassword } from '@/components/formulario/CampoPassword';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { EnlaceTexto } from '@/components/formulario/EnlaceTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TEXTOS_LOGIN, TEXTOS_RECUPERAR_PASSWORD } from '@/constants/constants';
import { formularioLoginStyles as styles } from '@/css/LoginPage';
import type { FormularioIngresarProps } from '@/interfaces';

export function FormularioIngresar({
  formulario,
  onCambiar,
  mostrarPassword,
  onCambiarMostrarPassword,
  enviando,
  error,
  aviso,
  onIngresar,
  onOlvidePassword,
}: FormularioIngresarProps) {
  return (
    <View style={styles.formulario}>
      <CampoTexto
        etiqueta={TEXTOS_LOGIN.campos.email}
        icono="correo"
        value={formulario.email}
        onChangeText={(v) => onCambiar('email', v)}
        placeholder={TEXTOS_LOGIN.campos.placeholderEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <CampoPassword
        etiqueta={TEXTOS_LOGIN.campos.password}
        value={formulario.password}
        onChangeText={(v) => onCambiar('password', v)}
        placeholder={TEXTOS_LOGIN.campos.placeholderPassword}
        visible={mostrarPassword}
        onCambiarVisible={onCambiarMostrarPassword}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={onIngresar}
      />

      <EnlaceTexto texto={TEXTOS_RECUPERAR_PASSWORD.enlace} onPress={onOlvidePassword} alineacion="derecha" />

      <MensajeFormulario tipo="aviso" texto={aviso} />
      <MensajeFormulario tipo="error" texto={error} />

      <View style={styles.espacioBoton}>
        <BotonPrincipal
          texto={TEXTOS_LOGIN.ingresar.boton}
          textoCargando={TEXTOS_LOGIN.ingresar.enviando}
          cargando={enviando}
          onPress={onIngresar}
        />
      </View>
    </View>
  );
}
