import { Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES, TEXTOS_FICHA_ADOPCION as T, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaChequeoStyles as styles } from '@/css/FichaAdopcionPage';
import type { TarjetaChequeoAdopcionProps } from '@/interfaces';
import { formatFechaLarga } from '@/lib/fechas';

/** El último chequeo veterinario, o el aviso "Revisión solicitada" si aún no lo revisan. */
export function TarjetaChequeoAdopcion({ chequeo, solicitado }: TarjetaChequeoAdopcionProps) {
  if (!chequeo && !solicitado) return null;
  if (!chequeo) {
    return (
      <View style={[styles.tarjeta, styles.solicitado]}>
        <View style={styles.icono}>
          <Icono nombre="relojArena" tamano={20} color={TONOS_TARJETA.crema.icono} />
        </View>
        <View style={styles.cuerpo}>
          <Text style={styles.titulo}>{T.chequeoSolicitado}</Text>
          <Text style={styles.texto}>{T.chequeoSolicitadoDetalle}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.tarjeta}>
      <View style={styles.icono}>
        <Icono nombre="estetoscopio" tamano={20} color={COLORES.primario} />
      </View>
      <View style={styles.cuerpo}>
        <Text style={styles.titulo}>{T.chequeoTitulo}</Text>
        <Text style={styles.quien}>{T.chequeoPor(chequeo.veterinario, chequeo.centro, formatFechaLarga(chequeo.fecha))}</Text>
        <Text style={styles.texto}>{chequeo.resumen}</Text>
      </View>
    </View>
  );
}
