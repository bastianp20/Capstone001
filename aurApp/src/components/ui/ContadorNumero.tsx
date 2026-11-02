import { Pressable, Text, View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { contadorNumeroStyles as styles } from '@/css/Compartido';
import type { ContadorNumeroProps } from '@/interfaces';

import { Icono } from './Icono';

/** Un número grande con botones − y +, con mínimo y máximo. Sin valor parte desde el mínimo. */
export function ContadorNumero({ valor, onCambiar, paso = 1, minimo = 0, maximo, formato = String, textoVacio = '—' }: ContadorNumeroProps) {
  const actual = valor ?? minimo;
  const puedeBajar = actual > minimo;
  const puedeSubir = maximo === undefined || actual < maximo;
  return (
    <View style={styles.fila}>
      <Pressable
        onPress={() => onCambiar(Math.max(minimo, actual - paso))}
        disabled={!puedeBajar}
        accessibilityRole="button"
        accessibilityLabel="−"
        style={[styles.boton, !puedeBajar && styles.deshabilitado]}>
        <Text style={styles.signo}>−</Text>
      </Pressable>
      <Text style={styles.valor}>{valor === null ? textoVacio : formato(valor)}</Text>
      <Pressable
        onPress={() => onCambiar(maximo === undefined ? actual + paso : Math.min(maximo, actual + paso))}
        disabled={!puedeSubir}
        accessibilityRole="button"
        accessibilityLabel="+"
        style={[styles.boton, !puedeSubir && styles.deshabilitado]}>
        <Icono nombre="mas" tamano={22} color={COLORES.texto} grosor={2.2} />
      </Pressable>
    </View>
  );
}
