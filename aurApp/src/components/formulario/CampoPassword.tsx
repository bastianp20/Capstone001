import { Pressable } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES, TEXTOS_LOGIN } from '@/constants/constants';
import { campoTextoStyles as styles } from '@/css/Compartido';
import type { CampoPasswordProps } from '@/interfaces';

import { CampoTexto } from './CampoTexto';

/** Campo de contraseña con el ojo para mostrarla u ocultarla. */
export function CampoPassword({ visible, onCambiarVisible, bloquearPegar, ...props }: CampoPasswordProps) {
  return (
    <CampoTexto
      icono="candado"
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      // Oculta el menú de copiar/pegar: la confirmación se escribe a mano, igual que en la web.
      contextMenuHidden={bloquearPegar}
      accesorioDerecho={
        <Pressable
          onPress={onCambiarVisible}
          hitSlop={10}
          accessibilityLabel={visible ? TEXTOS_LOGIN.campos.ocultarPassword : TEXTOS_LOGIN.campos.mostrarPassword}
          style={({ pressed }) => [styles.botonOjo, pressed && styles.presionado]}>
          <Icono nombre={visible ? 'ojoTachado' : 'ojo'} tamano={22} color={COLORES.primario} />
        </Pressable>
      }
      {...props}
    />
  );
}
