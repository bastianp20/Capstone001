import { useWindowDimensions, View } from 'react-native';

import { COLUMNAS_ADOPTA, MARGEN_PANTALLA, SEPARACION_GRILLA_ADOPTA } from '@/constants/constants';
import { useGrillaAnimalesStyles } from '@/css/AdoptaPage';
import type { GrillaAnimalesAdopcionProps } from '@/interfaces';

import { TarjetaAnimalAdopcion } from './TarjetaAnimalAdopcion';

/** Grilla de 2 columnas con los animales en adopción. */
export function GrillaAnimalesAdopcion({ animales, estaGuardado, onGuardar, onAbrir }: GrillaAnimalesAdopcionProps) {
  const styles = useGrillaAnimalesStyles();
  const { width } = useWindowDimensions();
  const ancho = (width - MARGEN_PANTALLA * 2 - SEPARACION_GRILLA_ADOPTA * (COLUMNAS_ADOPTA - 1)) / COLUMNAS_ADOPTA;
  return (
    <View style={[styles.grilla, { columnGap: SEPARACION_GRILLA_ADOPTA, rowGap: SEPARACION_GRILLA_ADOPTA }]}>
      {animales.map((a) => (
        <View key={a.id} style={{ width: ancho }}>
          <TarjetaAnimalAdopcion animal={a} guardado={estaGuardado(a.id)} onGuardar={() => onGuardar(a.id)} onPress={() => onAbrir(a.id)} />
        </View>
      ))}
    </View>
  );
}
