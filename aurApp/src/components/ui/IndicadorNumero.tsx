import { Text, View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { indicadorNumeroStyles as styles } from '@/css/Compartido';
import type { IndicadorNumeroProps } from '@/interfaces';

import { BarraProgreso } from './BarraProgreso';
import { CirculoIcono } from './CirculoIcono';

/** Tarjeta blanca con un número grande: "Citas hoy 6", "Usuarios 128". */
export function IndicadorNumero({ etiqueta, valor, icono, colorValor, progreso }: IndicadorNumeroProps) {
  return (
    <View style={styles.tarjeta} accessibilityLabel={`${etiqueta}: ${valor}`}>
      <View style={styles.cabecera}>
        <Text style={styles.etiqueta} numberOfLines={1}>
          {etiqueta}
        </Text>
        {icono && <CirculoIcono icono={icono} tamano={28} tamanoIcono={15} colorIcono={COLORES.primario} colorFondo={COLORES.primarioSuave} />}
      </View>
      <Text style={[styles.valor, colorValor ? { color: colorValor } : null]}>{valor}</Text>
      {progreso !== undefined && <BarraProgreso progreso={progreso} />}
    </View>
  );
}
