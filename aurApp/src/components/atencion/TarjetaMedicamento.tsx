import { Pressable, Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { COLORES, TEXTOS_RECETA_ATENCION as T } from '@/constants/constants';
import { tarjetaMedicamentoStyles as styles } from '@/css/RecetaPage';
import type { NombreIcono, TarjetaMedicamentoProps } from '@/interfaces';

/** Un medicamento de la receta: nombre, dosis, frecuencia y duración; editar y quitar. */
export function TarjetaMedicamento({ medicamento: m, onEditar, onQuitar }: TarjetaMedicamentoProps) {
  const datos: [NombreIcono, string][] = [
    ['pastilla', m.dosis],
    ['reloj', m.frecuencia],
    ['citas', m.duracion],
  ];
  return (
    <View style={styles.tarjeta}>
      <View style={styles.barra}>
        <Icono nombre="pastilla" tamano={20} color={COLORES.texto} />
      </View>
      <View style={styles.cuerpo}>
        <Text style={styles.nombre}>{m.nombre}</Text>
        <View style={styles.chips}>
          {datos.map(([icono, texto]) => (
            <View key={icono} style={styles.chip}>
              <Icono nombre={icono} tamano={12} color={COLORES.textoSecundario} />
              <Text style={styles.chipTexto}>{texto}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.acciones}>
        <Pressable onPress={onEditar} accessibilityRole="button" accessibilityLabel={T.editar} hitSlop={8}>
          <Icono nombre="editar" tamano={20} color={COLORES.texto} />
        </Pressable>
        <Pressable onPress={onQuitar} accessibilityRole="button" accessibilityLabel={T.quitar} hitSlop={8}>
          <Icono nombre="papelera" tamano={20} color={COLORES.coral} />
        </Pressable>
      </View>
    </View>
  );
}
