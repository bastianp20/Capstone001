import { Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES, TEXTOS_SOLIDARIA as T } from '@/constants/constants';
import { tarjetaImpactoStyles as styles } from '@/css/SolidariaPage';
import type { TarjetaImpactoSolidarioProps } from '@/interfaces';

/** Impacto del veterinario (sobre el verde): animales atendidos gratis, cuántos tienen familia y la insignia. */
export function TarjetaImpactoSolidario({ resumen }: TarjetaImpactoSolidarioProps) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.textos}>
        <Text style={styles.numero}>{T.atendidosGratis(resumen.solidarias)}</Text>
        <Text style={styles.detalle}>{T.conFamilia(resumen.adoptados)}</Text>
      </View>
      {resumen.aliado && (
        <View style={styles.insignia} accessibilityLabel={T.aliado}>
          <Icono nombre="corazon" tamano={22} color={COLORES.blanco} relleno />
          <Text style={styles.insigniaTexto}>{T.aliado}</Text>
        </View>
      )}
    </View>
  );
}
