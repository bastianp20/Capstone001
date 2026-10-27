import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HUELLAS_ENCABEZADO_PAGINA } from '@/constants/constants';
import { encabezadoPaginaStyles as styles } from '@/css/Compartido';
import type { EncabezadoPaginaProps } from '@/interfaces';

import { BotonIcono } from './BotonIcono';
import { EncabezadoVerde } from './EncabezadoVerde';

/** Encabezado verde compacto con la onda: lo usan Citas, Historial, Perfil y los formularios. */
export function EncabezadoPagina({ titulo, subtitulo, onVolver, accion, children, centrado }: EncabezadoPaginaProps) {
  const insets = useSafeAreaInsets();

  return (
    <EncabezadoVerde
      huellas={HUELLAS_ENCABEZADO_PAGINA}
      style={[styles.contenedor, centrado && styles.contenedorCentrado, { paddingTop: insets.top + 12 }]}>
      <View style={[styles.fila, centrado && styles.filaCentrada]}>
        {onVolver && <BotonIcono icono="atras" etiqueta="Volver" onPress={onVolver} variante="translucido" tamano={40} />}
        <View style={[styles.textos, centrado && styles.textosCentrados]}>
          <Text style={[styles.titulo, centrado && styles.tituloCentrado, !!subtitulo && styles.tituloConSubtitulo]} numberOfLines={1} accessibilityRole="header">
            {titulo}
          </Text>
          {subtitulo && (
            <Text style={styles.subtitulo} numberOfLines={1}>
              {subtitulo}
            </Text>
          )}
        </View>
        {accion}
      </View>
      {children}
    </EncabezadoVerde>
  );
}
