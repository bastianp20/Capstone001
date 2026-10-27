import { View } from 'react-native';

import { TarjetaOpcion } from '@/components/ui/TarjetaOpcion';
import { TEXTOS_PEDIR_HORA } from '@/constants/constants';
import { selectorDestinoStyles as styles } from '@/css/PedirHoraPage';
import type { SelectorDestinoProps } from '@/interfaces';

/** Centros aprobados + la opción "Veterinario independiente". */
export function SelectorDestino({ centros, destino, onElegir }: SelectorDestinoProps) {
  return (
    <View style={styles.lista}>
      {centros.map((c) => (
        <TarjetaOpcion
          key={c.id}
          icono="ubicacion"
          titulo={c.nombre}
          detalle={`${c.direccion}, ${c.comuna}`}
          seleccionada={destino === c.id}
          onPress={() => onElegir(c.id)}
        />
      ))}
      <TarjetaOpcion
        icono="estetoscopio"
        titulo={TEXTOS_PEDIR_HORA.independiente}
        detalle={TEXTOS_PEDIR_HORA.independienteDetalle}
        seleccionada={destino === 'independiente'}
        onPress={() => onElegir('independiente')}
      />
    </View>
  );
}
