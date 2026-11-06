import { Pressable, Text, View } from 'react-native';

import { Etiqueta } from '@/components/ui/Etiqueta';
import { TEXTOS_SOLIDARIA as T } from '@/constants/constants';
import { useTarjetaUrgenteStyles } from '@/css/SolidariaPage';
import type { TarjetaUrgenteSolidariaProps } from '@/interfaces';

import { FotoAnimal } from './FotoAnimal';
import { useColores } from '@/context/TemaContext';

/** Tarjeta chica de "Más urgentes": cuántos días lleva esperando y si está en su comuna. */
export function TarjetaUrgenteSolidaria({ animal: a, onPress }: TarjetaUrgenteSolidariaProps) {
  const COLORES = useColores();
  const styles = useTarjetaUrgenteStyles();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={a.nombre} style={styles.tarjeta}>
      <FotoAnimal fotoUrl={a.fotoUrl} especie={a.especie} estilo={styles.foto} />
      <View style={styles.cuerpo}>
        <Text style={styles.nombre} numberOfLines={1}>
          {a.nombre}
        </Text>
        <Etiqueta texto={T.esperandoHace(a.diasEsperando)} colorFondo={COLORES.peligroSuave} colorTexto={COLORES.peligro} />
        {a.enMiComuna && <Etiqueta texto={T.enTuComuna} colorFondo={COLORES.primarioSuave} colorTexto={COLORES.primarioOscuro} />}
      </View>
    </Pressable>
  );
}
