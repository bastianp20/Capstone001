import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Icono } from '@/components/ui/Icono';
import { TEXTOS_HORARIO_ATENCION as T } from '@/constants/constants';
import { useCampoComunasStyles } from '@/css/HorarioAtencionPage';
import type { CampoComunasProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Comunas donde atiende un veterinario independiente, como chips que se quitan con la X. */
export function CampoComunas({ comunas, onCambiar }: CampoComunasProps) {
  const COLORES = useColores();
  const styles = useCampoComunasStyles();
  const [texto, setTexto] = useState('');
  const agregar = () => {
    const comuna = texto.trim();
    if (comuna && !comunas.some((c) => c.toLowerCase() === comuna.toLowerCase())) onCambiar([...comunas, comuna]);
    setTexto('');
  };
  return (
    <View style={styles.contenedor}>
      <View style={styles.fila}>
        <TextInput style={styles.input} value={texto} onChangeText={setTexto} placeholder={T.placeholderComuna}
          placeholderTextColor={COLORES.placeholder} onSubmitEditing={agregar} returnKeyType="done" maxLength={60}
          accessibilityLabel={T.comunas} />
        <BotonPequeno texto={T.agregarComuna} onPress={agregar} deshabilitado={!texto.trim()} />
      </View>
      {comunas.length > 0 && (
        <View style={styles.chips}>
          {comunas.map((c) => (
            <View key={c} style={styles.chip}>
              <Text style={styles.chipTexto}>{c}</Text>
              <Pressable onPress={() => onCambiar(comunas.filter((x) => x !== c))} accessibilityLabel={`Quitar ${c}`} hitSlop={8}>
                <Icono nombre="cerrar" tamano={14} color={COLORES.primarioOscuro} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
