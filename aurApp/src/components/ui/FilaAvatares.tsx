import { Text, View } from 'react-native';

import { MAX_AVATARES_FILA } from '@/constants/constants';
import { filaAvataresStyles as styles } from '@/css/Compartido';
import type { FilaAvataresProps } from '@/interfaces';

import { AvatarPersona } from './AvatarPersona';

/** Caras superpuestas (los veterinarios de un centro) y "+N" si hay más. */
export function FilaAvatares({ personas, tamano = 30, maximo = MAX_AVATARES_FILA }: FilaAvataresProps) {
  const visibles = personas.slice(0, maximo);
  const resto = personas.length - visibles.length;
  return (
    <View style={styles.fila}>
      {visibles.map((p, i) => (
        <View key={`${p.nombre}-${i}`} style={[styles.item, i > 0 && { marginLeft: -tamano * 0.3 }]}>
          <AvatarPersona nombre={p.nombre} fotoUrl={p.fotoUrl} tamano={tamano} conBorde />
        </View>
      ))}
      {resto > 0 && (
        <View style={[styles.mas, { width: tamano, height: tamano, borderRadius: tamano / 2, marginLeft: -tamano * 0.3 }]}>
          <Text style={styles.masTexto}>+{resto}</Text>
        </View>
      )}
    </View>
  );
}
