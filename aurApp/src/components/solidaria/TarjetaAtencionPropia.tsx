import { Pressable, Text, View } from 'react-native';

import { Etiqueta } from '@/components/ui/Etiqueta';
import { COLORES, TEXTOS_SOLIDARIA as T, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaAnimalSolidarioStyles as styles } from '@/css/SolidariaPage';
import type { TarjetaAtencionPropiaProps } from '@/interfaces';
import { formatFechaLarga } from '@/lib/fechas';

import { FotoAnimal } from './FotoAnimal';

/** Una atención que registró el veterinario: animal, fecha, dónde, si fue solidaria y el resumen. */
export function TarjetaAtencionPropia({ atencion: a, onPress }: TarjetaAtencionPropiaProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}>
      <FotoAnimal fotoUrl={a.fotoUrl} especie={a.especie} estilo={styles.foto} />
      <View style={styles.cuerpo}>
        <Text style={styles.nombre} numberOfLines={1}>
          {a.nombre}
        </Text>
        <Text style={styles.detalle} numberOfLines={1}>
          {[T.atendidoEl(formatFechaLarga(a.fecha)), a.centro ?? T.aDomicilio].join(' · ')}
        </Text>
        <Text style={styles.resumen} numberOfLines={2}>
          {a.resumen}
        </Text>
        <View style={styles.chips}>
          {a.solidario ? (
            <Etiqueta texto={T.solidaria} icono="corazon" colorFondo={COLORES.primarioSuave} colorTexto={COLORES.primarioOscuro} />
          ) : (
            <Etiqueta texto={T.conCosto} icono="etiqueta" colorFondo={TONOS_TARJETA.crema.fondo} colorTexto={TONOS_TARJETA.crema.icono} />
          )}
        </View>
      </View>
    </Pressable>
  );
}
