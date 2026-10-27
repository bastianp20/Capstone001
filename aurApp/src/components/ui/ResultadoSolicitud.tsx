import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { COLORES } from '@/constants/constants';
import { resultadoSolicitudStyles as styles } from '@/css/Compartido';
import type { ResultadoSolicitudProps } from '@/interfaces';

import { CirculoIcono } from './CirculoIcono';

/** Pantalla de éxito después de enviar algo (una hora, un mensaje). */
export function ResultadoSolicitud({ titulo, detalle, textoBoton, onPress }: ResultadoSolicitudProps) {
  return (
    <View style={styles.contenedor}>
      <CirculoIcono icono="check" tamano={88} tamanoIcono={42} colorIcono={COLORES.blanco} colorFondo={COLORES.primario} grosor={2.6} />
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.detalle}>{detalle}</Text>
      <View style={styles.boton}>
        <BotonPrincipal texto={textoBoton} onPress={onPress} />
      </View>
    </View>
  );
}
