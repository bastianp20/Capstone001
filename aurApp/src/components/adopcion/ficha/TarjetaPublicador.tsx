import { Text, View } from 'react-native';

import { AvatarPersona } from '@/components/ui/AvatarPersona';
import { TEXTOS_FICHA_ADOPCION as T, TIPO_PUBLICADOR_TEXTO } from '@/constants/constants';
import { useTarjetaPublicadorStyles } from '@/css/FichaAdopcionPage';
import type { TarjetaPublicadorProps } from '@/interfaces';

/** Quién lo cuida: nombre, si es refugio, centro, veterinario o rescatista, y cuántas adopciones lleva. */
export function TarjetaPublicador({ publicador: p }: TarjetaPublicadorProps) {
  const styles = useTarjetaPublicadorStyles();
  const detalle = [TIPO_PUBLICADOR_TEXTO[p.tipo] ?? TIPO_PUBLICADOR_TEXTO.particular, p.adopciones > 0 ? T.adopciones(p.adopciones) : null]
    .filter(Boolean)
    .join(' · ');
  return (
    <View style={styles.tarjeta}>
      <AvatarPersona nombre={p.nombre} fotoUrl={null} tamano={48} />
      <View style={styles.cuerpo}>
        <Text style={styles.etiqueta}>{T.publicadoPor}</Text>
        <Text style={styles.nombre}>{p.nombre}</Text>
        <Text style={styles.detalle}>{detalle}</Text>
      </View>
    </View>
  );
}
