import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ALTURA_BARRA_NAVEGACION, COLORES } from '@/constants/constants';
import { pantallaListaStyles as styles } from '@/css/Compartido';
import type { PantallaListaProps } from '@/interfaces';

/** Base de las pestañas: encabezado + contenido con scroll, "tirar para recargar" y espacio para la barra inferior. */
export function PantallaLista({ encabezado, children, recargando = false, onRecargar }: PantallaListaProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.pantalla}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: ALTURA_BARRA_NAVEGACION + insets.bottom + 36 }}
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
