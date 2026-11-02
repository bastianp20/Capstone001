import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { ICONO_ESPECIE_ADOPCION, TEXTOS_ADOPTA as T, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaAnimalStyles as styles } from '@/css/AdoptaPage';
import type { TarjetaAnimalAdopcionProps } from '@/interfaces';

import { Icono } from '@/components/ui/Icono';

import { BotonGuardar } from './BotonGuardar';
import { SelloRevisado } from './SelloRevisado';

/** Tarjeta de la grilla de Adopta: foto, corazón, nombre, edad y comuna, y el sello si fue revisado. */
export function TarjetaAnimalAdopcion({ animal: a, guardado, onGuardar, onPress }: TarjetaAnimalAdopcionProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={a.nombre} style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}>
      <View>
        {a.fotoUrl ? (
          <Image source={{ uri: a.fotoUrl }} style={styles.foto} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.sinFoto, { backgroundColor: TONOS_TARJETA.durazno.fondo }]}>
            <Icono nombre={ICONO_ESPECIE_ADOPCION[a.especie]} tamano={44} color={TONOS_TARJETA.durazno.icono} grosor={1.6} />
          </View>
        )}
        {a.enProceso && <Text style={styles.enProceso}>{T.enProceso}</Text>}
        <View style={styles.guardar}>
          <BotonGuardar guardado={guardado} onPress={onGuardar} tamano={34} />
        </View>
      </View>
      <View style={styles.cuerpo}>
        <Text style={styles.nombre} numberOfLines={1}>
          {a.nombre}
        </Text>
        <Text style={styles.detalle} numberOfLines={1}>
          {a.edad} · {a.comuna}
        </Text>
        {a.chequeo && (
          <View style={styles.sello}>
            <SelloRevisado solidario={a.chequeo.solidario} compacto />
          </View>
        )}
      </View>
    </Pressable>
  );
}
