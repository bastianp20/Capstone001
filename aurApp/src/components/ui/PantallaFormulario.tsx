import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { pantallaFormularioStyles as styles } from '@/css/Compartido';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import type { PantallaFormularioProps } from '@/interfaces';

import { EncabezadoPagina } from './EncabezadoPagina';

/** Base de las pantallas con formulario (pedir hora, mascota, datos, contacto): encabezado con volver y teclado. */
export function PantallaFormulario({ titulo, children, pie }: PantallaFormularioProps) {
  const insets = useSafeAreaInsets();
  useBarraEstadoClara();

  return (
    <KeyboardAvoidingView style={styles.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: (pie ? 16 : insets.bottom + 24) }]}>
        <EncabezadoPagina titulo={titulo} onVolver={router.back} />
        <View style={styles.cuerpo}>{children}</View>
      </ScrollView>
      {pie && <View style={[styles.pie, { paddingBottom: insets.bottom + 12 }]}>{pie}</View>}
    </KeyboardAvoidingView>
  );
}
