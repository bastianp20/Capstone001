import { Pressable, Text, View } from 'react-native';

import { useTarjetaProgresoStyles } from '@/css/Compartido';
import type { TarjetaProgresoProps } from '@/interfaces';

import { BarraProgreso } from './BarraProgreso';
import { Icono } from './Icono';
import { useColores } from '@/context/TemaContext';

/** "Completa tu perfil": porcentaje, barra y los pasos que faltan (cada uno lleva a completarlo). Al 100% no se muestra. */
export function TarjetaProgreso({ titulo, textoPorcentaje, porcentaje, pendientes, onElegir }: TarjetaProgresoProps) {
  const COLORES = useColores();
  const styles = useTarjetaProgresoStyles();
  if (pendientes.length === 0) return null;
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo} accessibilityRole="header">{titulo}</Text>
      <Text style={styles.porcentaje}>{textoPorcentaje}</Text>
      <BarraProgreso progreso={porcentaje / 100} />
      {pendientes.map((p) => (
        <Pressable key={p.id} onPress={() => onElegir(p.id)} accessibilityRole="button"
          style={({ pressed }) => [styles.paso, pressed && styles.pasoPresionado]}>
          <Icono nombre={p.icono} tamano={18} color={COLORES.primario} />
          <Text style={styles.pasoTexto}>{p.texto}</Text>
          <Icono nombre="chevronDerecha" tamano={18} color={COLORES.textoSecundario} />
        </Pressable>
      ))}
    </View>
  );
}
