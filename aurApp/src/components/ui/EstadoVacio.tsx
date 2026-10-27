import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { COLORES } from '@/constants/constants';
import { estadoVacioStyles as styles } from '@/css/Compartido';
import type { EstadoVacioProps } from '@/interfaces';

import { CirculoIcono } from './CirculoIcono';

/** Mensaje cuando una lista está vacía o algo falló, con una acción opcional. */
export function EstadoVacio({ icono, titulo, detalle, textoAccion, onAccion }: EstadoVacioProps) {
  return (
    <View style={styles.contenedor}>
      <CirculoIcono icono={icono} tamano={72} tamanoIcono={30} colorIcono={COLORES.primario} colorFondo={COLORES.primarioSuave} />
      <Text style={styles.titulo}>{titulo}</Text>
      {detalle && <Text style={styles.detalle}>{detalle}</Text>}
      {textoAccion && onAccion && (
        <View style={styles.accion}>
          <BotonPrincipal texto={textoAccion} onPress={onAccion} />
        </View>
      )}
    </View>
  );
}
