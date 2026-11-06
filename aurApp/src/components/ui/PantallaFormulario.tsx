import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePantallaFormularioStyles } from '@/css/Compartido';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useScrollConTeclado } from '@/hooks/useScrollConTeclado';
import type { PantallaFormularioProps } from '@/interfaces';

import { EncabezadoPagina } from './EncabezadoPagina';

/** Base de las pantallas con formulario (pedir hora, mascota, datos, contacto): encabezado con volver; el teclado nunca tapa el campo que se escribe. */
export function PantallaFormulario({ titulo, children, pie, onVolver = router.back, subtitulo, accion }: PantallaFormularioProps) {
  const styles = usePantallaFormularioStyles();
  const insets = useSafeAreaInsets();
  useBarraEstadoClara();
  const teclado = useScrollConTeclado();
  const conTeclado = teclado.alto > 0;

  return (
    <View ref={teclado.contenedorRef} style={[styles.pantalla, { paddingBottom: teclado.alto }]}>
      <ScrollView
        ref={teclado.scrollRef}
        {...teclado.scrollProps}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: (pie ? 16 : insets.bottom + 24) }]}>
        <EncabezadoPagina titulo={titulo} subtitulo={subtitulo} accion={accion} onVolver={onVolver} />
        <View style={styles.cuerpo}>{children}</View>
      </ScrollView>
      {pie && <View style={[styles.pie, { paddingBottom: conTeclado ? 12 : insets.bottom + 12 }]}>{pie}</View>}
    </View>
  );
}
