import { Pressable, TextInput, View } from 'react-native';

import { COLORES } from '@/constants/constants';
import { campoBusquedaStyles as styles } from '@/css/Compartido';
import type { CampoBusquedaProps } from '@/interfaces';

import { Icono } from './Icono';

export function CampoBusqueda({ valor, onCambiar, placeholder }: CampoBusquedaProps) {
  return (
    <View style={styles.caja}>
      <Icono nombre="buscar" tamano={18} color={COLORES.textoSecundario} />
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={onCambiar}
        placeholder={placeholder}
        placeholderTextColor={COLORES.placeholder}
        selectionColor={COLORES.primario}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {valor.length > 0 && (
        <Pressable onPress={() => onCambiar('')} hitSlop={10} accessibilityLabel="Limpiar búsqueda">
          <Icono nombre="cerrar" tamano={18} color={COLORES.textoSecundario} />
        </Pressable>
      )}
    </View>
  );
}
