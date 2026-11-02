import { Pressable, Text, View } from 'react-native';

import { AvatarPersona } from '@/components/ui/AvatarPersona';
import { Icono } from '@/components/ui/Icono';
import { COLORES, MAX_CHIPS_DESTINO, TEXTOS_DERIVAR_ATENCION as T, TONOS_ESPECIALIDADES, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaDestinoDerivacionStyles as styles } from '@/css/DerivarPage';
import type { TarjetaDestinoDerivacionProps } from '@/interfaces';

/** Un colega (con su foto y dónde atiende) o un centro, con sus especialidades. */
export function TarjetaDestinoDerivacion({ destino: d, seleccionado, onPress }: TarjetaDestinoDerivacionProps) {
  const esVet = d.tipo === 'veterinario';
  const chips = esVet ? d.detalle.split(',').map((x) => x.trim()).filter(Boolean).slice(0, MAX_CHIPS_DESTINO) : [];
  const lugar = esVet ? (d.lugar ?? T.independiente) : d.detalle;
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected: seleccionado }} style={({ pressed }) => [styles.tarjeta, seleccionado && styles.seleccionada, pressed && styles.presionada]}>
      <AvatarPersona nombre={d.nombre} fotoUrl={d.fotoUrl} tamano={56} />
      <View style={styles.cuerpo}>
        <Text style={styles.nombre} numberOfLines={2}>
          {d.nombre}
        </Text>
        <View style={styles.lugar}>
          <Icono nombre={esVet ? 'centro' : 'ubicacion'} tamano={13} color={COLORES.textoSecundario} />
          <Text style={styles.lugarTexto} numberOfLines={1}>
            {lugar}
          </Text>
        </View>
        {chips.length > 0 && (
          <View style={styles.chips}>
            {chips.map((c, i) => {
              const tono = TONOS_TARJETA[TONOS_ESPECIALIDADES[(i + 1) % TONOS_ESPECIALIDADES.length]];
              return (
                <Text key={c} style={[styles.chip, { backgroundColor: tono.fondo, color: tono.icono }]}>
                  {c}
                </Text>
              );
            })}
          </View>
        )}
      </View>
      {seleccionado && (
        <View style={styles.check}>
          <Icono nombre="check" tamano={14} color={COLORES.blanco} grosor={3} />
        </View>
      )}
    </Pressable>
  );
}
