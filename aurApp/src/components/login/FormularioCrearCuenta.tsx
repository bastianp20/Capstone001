import { View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoPassword } from '@/components/formulario/CampoPassword';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TEXTOS_CONFIRMAR_PASSWORD, TEXTOS_LOGIN } from '@/constants/constants';
import { formularioLoginStyles as styles } from '@/css/LoginPage';
import type { FormularioCrearCuentaProps } from '@/interfaces';
import { passwordsNoCoinciden } from '@/lib/formularios';

export function FormularioCrearCuenta({
  formulario,
  onCambiar,
  mostrarPassword,
  onCambiarMostrarPassword,
  enviando,
  error,
  onCrear,
}: FormularioCrearCuentaProps) {
  const noCoinciden = passwordsNoCoinciden(formulario.password, formulario.confirmacion);

  return (
    <View style={styles.formulario}>
      <CampoTexto
        etiqueta={TEXTOS_LOGIN.campos.nombre}
        icono="persona"
        value={formulario.nombre}
        onChangeText={(v) => onCambiar('nombre', v)}
        placeholder={TEXTOS_LOGIN.campos.placeholderNombre}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
      />
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
      />
      <CampoPassword
        etiqueta={TEXTOS_LOGIN.campos.password}
        value={formulario.password}
        onChangeText={(v) => onCambiar('password', v)}
        placeholder={TEXTOS_LOGIN.campos.placeholderPassword}
        ayuda={TEXTOS_LOGIN.campos.ayudaPassword}
        visible={mostrarPassword}
        onCambiarVisible={onCambiarMostrarPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        bloquearPegar
      />
      <CampoPassword
        etiqueta={TEXTOS_CONFIRMAR_PASSWORD.etiqueta}
        value={formulario.confirmacion}
        onChangeText={(v) => onCambiar('confirmacion', v)}
        placeholder={TEXTOS_CONFIRMAR_PASSWORD.placeholder}
        error={noCoinciden ? TEXTOS_CONFIRMAR_PASSWORD.noCoinciden : undefined}
        ayuda={TEXTOS_CONFIRMAR_PASSWORD.ayuda}
        visible={mostrarPassword}
        onCambiarVisible={onCambiarMostrarPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        bloquearPegar
      />
      <CampoTexto
        etiqueta={TEXTOS_LOGIN.campos.telefono}
        icono="telefono"
        value={formulario.telefono}
        onChangeText={(v) => onCambiar('telefono', v)}
        placeholder={TEXTOS_LOGIN.campos.placeholderTelefono}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
      />

      <MensajeFormulario tipo="error" texto={error} />

      <View style={styles.espacioBoton}>
        <BotonPrincipal
          texto={TEXTOS_LOGIN.crear.boton}
          textoCargando={TEXTOS_LOGIN.crear.enviando}
          cargando={enviando}
          onPress={onCrear}
        />
      </View>
    </View>
  );
}
