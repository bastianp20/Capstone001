import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ALTURA_BARRA_NAVEGACION } from '@/constants/constants';
import { usePantallaListaStyles } from '@/css/Compartido';
import { useScrollConTeclado } from '@/hooks/useScrollConTeclado';
import type { PantallaListaProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Base de las pestañas: encabezado + contenido con scroll, "tirar para recargar" espacio para la barra inferior y para el teclado. */
export function PantallaLista({ encabezado, children, recargando = false, onRecargar }: PantallaListaProps) {
  const COLORES = useColores();
  const styles = usePantallaListaStyles();
  const insets = useSafeAreaInsets();
  const teclado = useScrollConTeclado();

  return (
    <View ref={teclado.contenedorRef} style={[styles.pantalla, { paddingBottom: teclado.alto }]}>
      <ScrollView
        ref={teclado.scrollRef}
        {...teclado.scrollProps}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: teclado.alto ? 24 : ALTURA_BARRA_NAVEGACION + insets.bottom + 36 }}
        refreshControl={
          onRecargar && (
            <RefreshControl refreshing={recargando} onRefresh={onRecargar} tintColor={COLORES.blanco} colors={[COLORES.primario]} />
          )
        }>
        {encabezado}
        <View style={styles.cuerpo}>{children}</View>
      </ScrollView>
    </View>
  );
}
