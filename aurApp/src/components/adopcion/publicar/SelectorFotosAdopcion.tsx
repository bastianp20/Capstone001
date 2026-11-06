import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { Icono } from '@/components/ui/Icono';
import { MAX_FOTOS_ADOPCION, TEXTOS_PUBLICAR as T } from '@/constants/constants';
import { useSelectorFotosStyles } from '@/css/PublicarAdopcionPage';
import type { SelectorFotosAdopcionProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Fotos elegidas (la primera es la principal) y el recuadro para agregar otra. */
export function SelectorFotosAdopcion({ fotos, onAgregar, onQuitar, error }: SelectorFotosAdopcionProps) {
  const COLORES = useColores();
  const styles = useSelectorFotosStyles();
  return (
    <GrupoCampo titulo={T.fotos} ayuda={T.fotosAyuda(fotos.length)} error={error}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fila}>
        {fotos.map((f, i) => (
          <View key={f.uri}>
            <Image source={{ uri: f.uri }} style={styles.foto} contentFit="cover" />
            {i === 0 && <Text style={styles.principal}>{T.principal}</Text>}
            <Pressable onPress={() => onQuitar(i)} hitSlop={6} accessibilityRole="button" accessibilityLabel={T.quitarFoto} style={styles.quitar}>
              <Icono nombre="cerrar" tamano={14} color={COLORES.blanco} grosor={2.6} />
            </Pressable>
          </View>
        ))}
        {fotos.length < MAX_FOTOS_ADOPCION && (
          <Pressable onPress={onAgregar} accessibilityRole="button" style={[styles.agregar, !!error && styles.agregarError]}>
            <Icono nombre="camara" tamano={24} color={error ? COLORES.error : COLORES.primario} />
            <Text style={styles.agregarTexto}>{T.agregarFoto}</Text>
          </Pressable>
        )}
      </ScrollView>
    </GrupoCampo>
  );
}
