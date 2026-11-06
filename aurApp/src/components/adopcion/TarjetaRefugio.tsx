import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { BarraProgreso } from '@/components/ui/BarraProgreso';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Icono } from '@/components/ui/Icono';
import { ESTILO_RECEPCION_REFUGIO, TEXTOS_REFUGIOS as T } from '@/constants/constants';
import { useTarjetaRefugioStyles } from '@/css/AdoptaPage';
import type { TarjetaRefugioProps } from '@/interfaces';
import { ocupacionRefugio } from '@/lib/adopcion';
import { useColores } from '@/context/TemaContext';

/** Un refugio verificado: portada, logo, si recibe animales, sus cupos y cómo ayudar. */
export function TarjetaRefugio({ refugio: r, onVerAnimales, onContactar }: TarjetaRefugioProps) {
  const COLORES = useColores();
  const styles = useTarjetaRefugioStyles();
  const recepcion = ESTILO_RECEPCION_REFUGIO[r.recibe];
  const ocupacion = ocupacionRefugio(r);
  return (
    <View style={styles.tarjeta}>
      {r.portadaUrl ? <Image source={{ uri: r.portadaUrl }} style={styles.portada} contentFit="cover" /> : <View style={styles.portada} />}
      <Text style={[styles.recepcion, { backgroundColor: recepcion.fondo, color: recepcion.color }]}>{recepcion.texto}</Text>
      {r.logoUrl ? (
        <Image source={{ uri: r.logoUrl }} style={styles.logo} contentFit="cover" />
      ) : (
        <View style={[styles.logo, styles.logoVacio]}>
          <Icono nombre="casa" tamano={26} color={COLORES.primario} />
        </View>
      )}
      <View style={styles.cuerpo}>
        <View>
          <Text style={styles.nombre}>{r.nombre}</Text>
          <View style={styles.lugar}>
            <Icono nombre="ubicacion" tamano={13} color={COLORES.textoSecundario} />
            <Text style={styles.lugarTexto}>
              {r.comuna}, {r.region}
            </Text>
          </View>
        </View>
        {!!r.descripcion && (
          <Text style={styles.descripcion} numberOfLines={3}>
            {r.descripcion}
          </Text>
        )}
        {r.cuposTotales > 0 && (
          <View style={styles.cupos}>
            <View style={styles.cuposFila}>
              <Text style={styles.cuposTexto}>{T.cupos(r.cuposOcupados, r.cuposTotales)}</Text>
              <Text style={styles.enAdopcion}>{T.enAdopcion(r.enAdopcion)}</Text>
            </View>
            <BarraProgreso progreso={ocupacion} color={recepcion.color} />
          </View>
        )}
        <View style={styles.botones}>
          {r.enAdopcion > 0 && <BotonPequeno texto={T.verAnimales} icono="huella" variante="primario" onPress={onVerAnimales} />}
          <BotonPequeno texto={T.contactar} icono="telefono" onPress={onContactar} />
        </View>
      </View>
    </View>
  );
}
