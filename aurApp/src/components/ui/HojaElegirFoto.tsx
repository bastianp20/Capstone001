import { View } from 'react-native';

import { TEXTOS_PUBLICAR as T } from '@/constants/constants';
import { hojaElegirFotoStyles as styles } from '@/css/Compartido';
import type { HojaElegirFotoProps } from '@/interfaces';

import { HojaInferior } from './HojaInferior';
import { OpcionHoja } from './OpcionHoja';

/** Hoja con "Tomar foto" y "Elegir de la galería". */
export function HojaElegirFoto({ visible, titulo, onTomar, onElegir, onCerrar }: HojaElegirFotoProps) {
  return (
    <HojaInferior visible={visible} titulo={titulo} onCerrar={onCerrar}>
      <View style={styles.fila}>
        <OpcionHoja icono="camara" texto={T.tomarFoto} tono="menta" onPress={onTomar} />
        <OpcionHoja icono="imagen" texto={T.elegirGaleria} tono="lavanda" onPress={onElegir} />
      </View>
    </HojaInferior>
  );
}
