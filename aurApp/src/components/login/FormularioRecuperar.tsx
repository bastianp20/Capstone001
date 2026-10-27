import { View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { EnlaceTexto } from '@/components/formulario/EnlaceTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TEXTOS_LOGIN, TEXTOS_RECUPERAR_PASSWORD } from '@/constants/constants';
import { formularioLoginStyles as styles } from '@/css/LoginPage';
import type { FormularioRecuperarProps } from '@/interfaces';

export function FormularioRecuperar({
  email,
  onCambiarEmail,
  enviando,
  error,
  aviso,
  onEnviar,
  onVolver,
}: FormularioRecuperarProps) {
  return (
    <View style={styles.formulario}>
      <CampoTexto
        etiqueta={TEXTOS_LOGIN.campos.email}
        icono="correo"
        value={email}
        onChangeText={onCambiarEmail}
        placeholder={TEXTOS_LOGIN.campos.placeholderEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={onEnviar}
      />

      <MensajeFormulario tipo="aviso" texto={aviso} />
      <MensajeFormulario tipo="error" texto={error} />

      <View style={styles.espacioBoton}>
        <BotonPrincipal
          texto={TEXTOS_RECUPERAR_PASSWORD.enviar}
          textoCargando={TEXTOS_RECUPERAR_PASSWORD.enviando}
          cargando={enviando}
          onPress={onEnviar}
        />
      </View>

      <EnlaceTexto texto={TEXTOS_RECUPERAR_PASSWORD.volver} onPress={onVolver} alineacion="centro" />
    </View>
  );
}
