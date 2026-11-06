import { Pressable, Text, View } from 'react-native';

import { AvatarPersona } from '@/components/ui/AvatarPersona';
import { FilaAvatares } from '@/components/ui/FilaAvatares';
import { Icono } from '@/components/ui/Icono';

import { useTarjetaDestinoCitaStyles } from '@/css/PedirHoraPage';
import type { TarjetaDestinoCitaProps, TonoTarjeta } from '@/interfaces';
import { useColores, useTonosTarjeta } from '@/context/TemaContext';

const TONOS_CHIP: TonoTarjeta[] = ['menta', 'durazno', 'lavanda', 'crema'];

/** Un centro (o un veterinario independiente): logo o foto, nombre, comuna, caras y especialidades. */
export function TarjetaDestinoCita({ opcion: o, seleccionada, onPress }: TarjetaDestinoCitaProps) {
  const COLORES = useColores();
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useTarjetaDestinoCitaStyles();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: seleccionada }}
      style={({ pressed }) => [styles.tarjeta, seleccionada && styles.seleccionada, pressed && styles.presionada]}>
      <AvatarPersona nombre={o.logo.nombre} fotoUrl={o.logo.fotoUrl} tamano={56} />
      <View style={styles.cuerpo}>
        <Text style={styles.titulo} numberOfLines={2}>
          {o.titulo}
        </Text>
        <View style={styles.detalle}>
          <Icono nombre="ubicacion" tamano={14} color={COLORES.textoSecundario} />
          <Text style={styles.detalleTexto} numberOfLines={2}>
            {o.detalle}
          </Text>
        </View>
        {(o.personas.length > 0 || o.chips.length > 0) && (
          <View style={styles.pie}>
            {o.personas.length > 0 && <FilaAvatares personas={o.personas} tamano={28} />}
            {o.chips.map((c, i) => {
              const tono = TONOS_TARJETA[TONOS_CHIP[i % TONOS_CHIP.length]];
              return (
                <Text key={c} style={[styles.chip, { backgroundColor: tono.fondo, color: tono.icono }]} numberOfLines={1}>
                  {c}
                </Text>
              );
            })}
          </View>
        )}
      </View>
      {seleccionada && (
        <View style={styles.check}>
          <Icono nombre="check" tamano={14} color={COLORES.blanco} grosor={3} />
        </View>
      )}
    </Pressable>
  );
}
