import { Text, View } from 'react-native';

import { CirculoIcono } from '@/components/ui/CirculoIcono';
import { TarjetaPastel } from '@/components/ui/TarjetaPastel';
import { COLORES, TEXTOS_INICIO, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaSintomasStyles as styles } from '@/css/InicioPage';
import type { TarjetaSintomasProps } from '@/interfaces';

export function TarjetaSintomas({ nombreMascota, onPress }: TarjetaSintomasProps) {
  const tono = TONOS_TARJETA.crema;

  return (
    <TarjetaPastel tono="crema" onPress={onPress} style={styles.tarjeta}>
      <CirculoIcono icono="estetoscopio" tamano={42} tamanoIcono={20} colorIcono={tono.icono} colorFondo={tono.iconoFondo} />
      <View style={styles.textos}>
        <Text style={styles.titulo}>{TEXTOS_INICIO.sintomasPregunta(nombreMascota)}</Text>
        <Text style={styles.detalle}>{TEXTOS_INICIO.sintomasDetalle}</Text>
      </View>
      <CirculoIcono icono="flecha" tamano={36} tamanoIcono={18} colorIcono={COLORES.texto} colorFondo={COLORES.blanco} grosor={2.2} />
    </TarjetaPastel>
  );
}
