import { Pressable, Text, View } from 'react-native';

import { Etiqueta } from '@/components/ui/Etiqueta';
import { Icono } from '@/components/ui/Icono';
import { ESTILO_ESTADO_POSTULACION, TEXTOS_POSTULANTES as T } from '@/constants/constants';
import { useTarjetaPostulanteStyles } from '@/css/MisPublicacionesPage';
import type { TarjetaPostulanteProps } from '@/interfaces';
import { haceCuanto, lineasHogar } from '@/lib/adopcion';

import { AfinidadAnillo } from './AfinidadAnillo';
import { useColores } from '@/context/TemaContext';

/** Una persona que postula: afinidad, nombre, estado, su hogar y hace cuánto postuló. */
export function TarjetaPostulante({ postulante: { postulacion: p, afinidad }, onPress }: TarjetaPostulanteProps) {
  const COLORES = useColores();
  const styles = useTarjetaPostulanteStyles();
  const estado = ESTILO_ESTADO_POSTULACION[p.estado];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.tarjeta, p.estado === 'aceptada' && styles.elegida, (p.estado === 'rechazada' || p.estado === 'retirada') && styles.apagada]}>
      <AfinidadAnillo porcentaje={afinidad.porcentaje} tamano={54} />
      <View style={styles.cuerpo}>
        <View style={styles.filaNombre}>
          <Text style={styles.nombre} numberOfLines={1}>
            {p.nombre}
          </Text>
          <Etiqueta texto={estado.texto} colorFondo={estado.fondo} colorTexto={estado.color} />
        </View>
        <Text style={styles.detalle} numberOfLines={1}>
          {lineasHogar(p)[0].texto}
        </Text>
        <Text style={styles.detalle}>{T.hace(haceCuanto(p.creadaEn))}</Text>
      </View>
      <Icono nombre="chevronDerecha" tamano={20} color={COLORES.textoSecundario} />
    </Pressable>
  );
}
