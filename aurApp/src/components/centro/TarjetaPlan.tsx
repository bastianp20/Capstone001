import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { COLORES, TEXTOS_PLANES as T } from '@/constants/constants';
import { tarjetaPlanStyles as styles } from '@/css/CentroPage';
import type { TarjetaPlanProps } from '@/interfaces';
import { formatearPrecio } from '@/lib/formatos';

export function TarjetaPlan({ plan, esActual, esSolicitado, puedeSolicitar, onSolicitar }: TarjetaPlanProps) {
  return (
    <View style={[styles.tarjeta, esActual && styles.actual]}>
      <View style={styles.cabecera}>
        <Text style={styles.nombre}>{plan.nombre}</Text>
        {esActual && <Etiqueta texto={T.actual} colorFondo={COLORES.primario} colorTexto={COLORES.blanco} />}
        {esSolicitado && <Etiqueta texto={T.solicitado} colorFondo={COLORES.estados.pendiente.fondo} colorTexto={COLORES.estados.pendiente.texto} />}
      </View>
      <Text style={styles.precio}>
        {plan.precioMensual === 0 ? T.gratis : formatearPrecio(plan.precioMensual)}
        {plan.precioMensual > 0 && <Text style={styles.porMes}>{T.porMes}</Text>}
      </Text>
      <Text style={styles.detalle}>{T.limite(plan.limiteVeterinarios)}</Text>
      {!esActual && !esSolicitado && puedeSolicitar && (
        <View style={styles.accion}>
          <BotonPequeno texto={T.solicitar} variante="primario" onPress={() => onSolicitar(plan)} />
        </View>
      )}
    </View>
  );
}
