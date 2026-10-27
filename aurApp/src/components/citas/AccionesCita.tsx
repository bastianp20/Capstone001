import { View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { TEXTOS_CITAS } from '@/constants/constants';
import { accionesCitaStyles as styles } from '@/css/CitasPage';
import type { AccionesCitaProps } from '@/interfaces';
import { abrirEnMapa } from '@/lib/mapas';

/** "Cómo llegar" (si el centro tiene dirección) y "Cancelar cita" (si todavía se puede). */
export function AccionesCita({ cita, cancelando, onCancelar }: AccionesCitaProps) {
  const { direccion } = cita;
  if (!direccion && !cita.puedeCancelar) return null;

  return (
    <View style={styles.fila}>
      {direccion && <BotonPequeno texto={TEXTOS_CITAS.comoLlegar} icono="ubicacion" onPress={() => abrirEnMapa(direccion)} />}
      {cita.puedeCancelar && (
        <BotonPequeno texto={TEXTOS_CITAS.cancelar} variante="peligro" cargando={cancelando} onPress={() => onCancelar(cita)} />
      )}
    </View>
  );
}
