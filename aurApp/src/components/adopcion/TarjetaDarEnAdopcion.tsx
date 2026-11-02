import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Icono } from '@/components/ui/Icono';
import { TEXTOS_ADOPTA as T, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaDarEnAdopcionStyles as styles } from '@/css/AdoptaPage';
import type { TarjetaDarEnAdopcionProps } from '@/interfaces';

/** Invitación a "Dar en adopción" y acceso a "Mis publicaciones". */
export function TarjetaDarEnAdopcion({ onPublicar, onMisPublicaciones }: TarjetaDarEnAdopcionProps) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.encabezado}>
        <View style={styles.icono}>
          <Icono nombre="casa" tamano={24} color={TONOS_TARJETA.durazno.icono} />
        </View>
        <View style={styles.textos}>
          <Text style={styles.titulo}>{T.darEnAdopcionTitulo}</Text>
          <Text style={styles.texto}>{T.darEnAdopcionTexto}</Text>
        </View>
      </View>
      <View style={styles.botones}>
        <BotonPequeno texto={T.publicar} icono="mas" variante="primario" onPress={onPublicar} />
        <BotonPequeno texto={T.misPublicaciones} icono="ficha" onPress={onMisPublicaciones} />
      </View>
    </View>
  );
}
