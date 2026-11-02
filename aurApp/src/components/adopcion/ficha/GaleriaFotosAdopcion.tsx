import { Image } from 'expo-image';
import { useState } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BotonIcono } from '@/components/ui/BotonIcono';
import { Icono } from '@/components/ui/Icono';
import { PROPORCION_GALERIA_ADOPCION, TEXTOS_FICHA_ADOPCION as T, TONOS_TARJETA } from '@/constants/constants';
import { galeriaFotosStyles as styles } from '@/css/FichaAdopcionPage';
import type { GaleriaFotosAdopcionProps } from '@/interfaces';

/** Fotos del animal a todo el ancho (se deslizan), con volver y las acciones arriba. */
export function GaleriaFotosAdopcion({ fotos, nombre, onVolver, acciones }: GaleriaFotosAdopcionProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [actual, setActual] = useState(0);
  const alto = width * PROPORCION_GALERIA_ADOPCION;

  const alDeslizar = (e: NativeSyntheticEvent<NativeScrollEvent>) => setActual(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <View style={[styles.contenedor, { height: alto }]}>
      {fotos.length ? (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={alDeslizar}>
          {fotos.map((uri, i) => (
            <Image key={uri} source={{ uri }} style={{ width, height: alto }} contentFit="cover" transition={200} accessibilityLabel={T.fotoDe(nombre, i + 1)} />
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.sinFoto, { height: alto }]}>
          <Icono nombre="huella" tamano={72} color={TONOS_TARJETA.durazno.icono} grosor={1.4} />
        </View>
      )}
      <View style={[styles.barra, { top: insets.top + 8 }]}>
        <BotonIcono icono="atras" etiqueta="Volver" onPress={onVolver} variante="blanco" tamano={42} />
        <View style={styles.acciones}>{acciones}</View>
      </View>
      {fotos.length > 1 && (
        <View style={styles.puntos}>
          {fotos.map((uri, i) => (
            <View key={uri} style={[styles.punto, i === actual && styles.puntoActivo]} />
          ))}
        </View>
      )}
    </View>
  );
}
