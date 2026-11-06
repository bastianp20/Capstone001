import { Pressable, Text, View } from 'react-native';

import { useContadorNumeroStyles } from '@/css/Compartido';
import type { ContadorNumeroProps } from '@/interfaces';
import { sumarPaso } from '@/lib/formatos';

import { Icono } from './Icono';
import { useColores } from '@/context/TemaContext';

/** Un número grande con botones − y +, con mínimo y máximo. Sin valor parte desde el mínimo. */
export function ContadorNumero({ valor, onCambiar, paso = 1, minimo = 0, maximo, formato = String, textoVacio = '—' }: ContadorNumeroProps) {
  const COLORES = useColores();
  const styles = useContadorNumeroStyles();
  const actual = valor ?? minimo;
  const puedeBajar = actual > minimo;
  const puedeSubir = maximo === undefined || actual < maximo;
  return (
    <View style={styles.fila}>
      <Pressable
        onPress={() => onCambiar(sumarPaso(actual, -paso, minimo, maximo))}
        disabled={!puedeBajar}
        accessibilityRole="button"
        accessibilityLabel="−"
        style={[styles.boton, !puedeBajar && styles.deshabilitado]}>
        <Text style={styles.signo}>−</Text>
      </Pressable>
      <Text style={styles.valor} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
        {valor === null ? textoVacio : formato(valor)}
      </Text>
      <Pressable
        onPress={() => onCambiar(sumarPaso(actual, paso, minimo, maximo))}
        disabled={!puedeSubir}
        accessibilityRole="button"
        accessibilityLabel="+"
        style={[styles.boton, !puedeSubir && styles.deshabilitado]}>
        <Icono nombre="mas" tamano={22} color={COLORES.texto} grosor={2.2} />
      </Pressable>
    </View>
  );
}
