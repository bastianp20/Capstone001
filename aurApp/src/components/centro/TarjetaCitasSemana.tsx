import { Text } from 'react-native';

import { MiniGraficoBarras } from '@/components/ui/MiniGraficoBarras';
import { TarjetaPastel } from '@/components/ui/TarjetaPastel';
import { DIAS_SEMANA_INICIAL, TEXTOS_CENTRO } from '@/constants/constants';
import { tarjetaCitasSemanaStyles as styles } from '@/css/CentroPage';
import type { TarjetaCitasSemanaProps } from '@/interfaces';

/** "Citas de hoy 14" con las barras de la semana (hoy destacado). */
export function TarjetaCitasSemana({ citasHoy, porDia, indiceHoy }: TarjetaCitasSemanaProps) {
  return (
    <TarjetaPastel tono="menta" style={styles.tarjeta}>
      <Text style={styles.etiqueta}>{TEXTOS_CENTRO.citasHoy}</Text>
      <Text style={styles.valor}>{citasHoy}</Text>
      <MiniGraficoBarras valores={porDia} etiquetas={DIAS_SEMANA_INICIAL} indiceDestacado={indiceHoy} alto={56} />
    </TarjetaPastel>
  );
}
