import { View } from 'react-native';

import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { TEXTOS_CITAS } from '@/constants/constants';
import { listaCitasStyles as styles } from '@/css/CitasPage';
import type { ListaCitasProps } from '@/interfaces';

import { TarjetaCita } from './TarjetaCita';

/** Citas agrupadas ("Esta semana", "Más adelante"); las de esta semana se muestran en detalle. */
export function ListaCitas({ grupos, fotoDe, cancelandoId, onCancelar }: ListaCitasProps) {
  return (
    <View style={styles.contenedor}>
      {grupos.map((grupo) => (
        <View key={grupo.titulo || 'todas'} style={styles.grupo}>
          {grupo.titulo ? <TituloSeccion texto={grupo.titulo} /> : null}
          {grupo.citas.map((cita) => (
            <TarjetaCita
              key={cita.id}
              cita={cita}
              fotoMascota={fotoDe(cita.mascotaId)}
              variante={grupo.titulo === TEXTOS_CITAS.estaSemana ? 'detallada' : 'compacta'}
              cancelando={cancelandoId === cita.id}
              onCancelar={onCancelar}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
