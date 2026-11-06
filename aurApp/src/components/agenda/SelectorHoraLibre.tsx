import { Text, View } from 'react-native';

import { ChipsOpcion } from '@/components/ui/ChipsOpcion';
import { useCambioHoraStyles } from '@/css/MiAgendaPage';
import type { SelectorHoraLibreProps } from '@/interfaces';
import { agruparPorDia } from '@/lib/agendaSemana';
import { formatFechaLarga } from '@/lib/fechas';

/** Horas libres agrupadas por día, en filas que se envuelven (sin scroll horizontal). */
export function SelectorHoraLibre({ horas, elegida, onElegir }: SelectorHoraLibreProps) {
  const styles = useCambioHoraStyles();
  return (
    <View style={styles.seccion}>
      {agruparPorDia(horas).map((g) => (
        <View key={g.fecha} style={styles.grupoDia}>
          <Text style={styles.tituloDia}>{formatFechaLarga(g.fecha)}</Text>
          <ChipsOpcion
            opciones={g.horas.map((h) => ({ valor: h.inicio, texto: h.hora }))}
            valor={elegida}
            onCambiar={(inicio) => {
              const h = g.horas.find((x) => x.inicio === inicio);
              if (h) onElegir(h);
            }}
          />
        </View>
      ))}
    </View>
  );
}
