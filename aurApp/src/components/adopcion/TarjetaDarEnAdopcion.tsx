import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Icono } from '@/components/ui/Icono';
import { TEXTOS_ADOPTA as T } from '@/constants/constants';
import { useTarjetaDarEnAdopcionStyles } from '@/css/AdoptaPage';
import type { TarjetaDarEnAdopcionProps } from '@/interfaces';
import { useTonosTarjeta } from '@/context/TemaContext';

/** Invitación a "Dar en adopción" y acceso a "Mis publicaciones". */
export function TarjetaDarEnAdopcion({ onPublicar, onMisPublicaciones }: TarjetaDarEnAdopcionProps) {
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useTarjetaDarEnAdopcionStyles();
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
