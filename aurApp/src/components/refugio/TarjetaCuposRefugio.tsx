import { Text, View } from 'react-native';

import { BarraProgreso } from '@/components/ui/BarraProgreso';
import { ContadorNumero } from '@/components/ui/ContadorNumero';
import { TEXTOS_MI_REFUGIO as T } from '@/constants/constants';
import { useTarjetaCuposStyles } from '@/css/MiRefugioPage';
import type { TarjetaCuposRefugioProps } from '@/interfaces';
import { haceCuanto } from '@/lib/adopcion';
import { useColores } from '@/context/TemaContext';

/** Cupos ocupados con − / + (se guardan solos), la barra de ocupación y cuándo se actualizó. */
export function TarjetaCuposRefugio({ ocupados, totales, actualizadoEn, guardando, onCambiar }: TarjetaCuposRefugioProps) {
  const COLORES = useColores();
  const styles = useTarjetaCuposStyles();
  const ocupacion = totales > 0 ? Math.min(1, ocupados / totales) : 0;
  const color = ocupacion >= 1 ? COLORES.peligro : ocupacion >= 0.8 ? COLORES.estados.pendiente.texto : COLORES.primario;
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>{T.cupos}</Text>
      <ContadorNumero valor={ocupados} onCambiar={onCambiar} minimo={0} maximo={totales} />
      <Text style={styles.deTotal}>{T.deTotal(totales)}</Text>
      <BarraProgreso progreso={ocupacion} color={color} />
      <Text style={styles.estado}>{guardando ? T.guardando : actualizadoEn ? T.actualizado(haceCuanto(actualizadoEn)) : ' '}</Text>
    </View>
  );
}
