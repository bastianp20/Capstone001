import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { Icono } from '@/components/ui/Icono';
import { ESTILO_ESTADO_PUBLICACION, ICONO_ESPECIE_ADOPCION, TEXTOS_MIS_PUBLICACIONES as T } from '@/constants/constants';
import { useTarjetaPublicacionStyles } from '@/css/MisPublicacionesPage';
import type { TarjetaPublicacionPropiaProps } from '@/interfaces';

import { AvisoModeracionPublicacion } from './AvisoModeracionPublicacion';
import { CaminoACasa } from './CaminoACasa';
import { useColores, useTonosTarjeta } from '@/context/TemaContext';

/** Una publicación mía: foto, estado, postulaciones, aviso de moderación, camino a casa y retirar / volver a publicar. */
export function TarjetaPublicacionPropia({ publicacion: p, ocupado, onPress, onRetirar, onRepublicar }: TarjetaPublicacionPropiaProps) {
  const COLORES = useColores();
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useTarjetaPublicacionStyles();
  const estado = ESTILO_ESTADO_PUBLICACION[p.estado];
  const detalle = [p.raza, p.edad, p.comuna].join(' · ');
  const subtitulo = p.elegido ? T.familia(p.elegido) : p.refugio ? T.aNombreDe(p.refugio) : null;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}>
      <View style={styles.fila}>
        {p.fotoUrl ? (
          <Image source={{ uri: p.fotoUrl }} style={styles.foto} contentFit="cover" />
        ) : (
          <View style={[styles.foto, styles.sinFoto]}>
            <Icono nombre={ICONO_ESPECIE_ADOPCION[p.especie]} tamano={30} color={TONOS_TARJETA.durazno.icono} />
          </View>
        )}
        <View style={styles.cuerpo}>
          <View style={styles.filaNombre}>
            <Text style={styles.nombre} numberOfLines={1}>
              {p.nombre}
            </Text>
            <Etiqueta texto={estado.texto} colorFondo={estado.fondo} colorTexto={estado.color} />
          </View>
          <Text style={styles.detalle} numberOfLines={1}>
            {detalle}
          </Text>
          {subtitulo && <Text style={styles.detalle}>{subtitulo}</Text>}
          <View style={styles.postulaciones}>
            <Icono nombre="persona" tamano={14} color={p.postulaciones ? COLORES.primario : COLORES.textoSecundario} />
            <Text style={[styles.postulacionesTexto, !p.postulaciones && styles.sinPostulaciones]}>
              {p.postulaciones ? T.postulaciones(p.postulaciones, p.nuevas) : T.sinPostulaciones}
            </Text>
          </View>
        </View>
      </View>
      {p.moderacion && <AvisoModeracionPublicacion aviso={p.moderacion} />}
      {p.estado !== 'retirada' && <CaminoACasa publicacion={p} />}
      {(p.estado === 'publicada' || p.estado === 'retirada') && (
        <View style={styles.acciones}>
          {p.estado === 'publicada' ? (
            <BotonPequeno texto={T.retirar} icono="ojoTachado" variante="peligro" onPress={onRetirar} cargando={ocupado} />
          ) : (
            <BotonPequeno texto={T.republicar} icono="enviar" onPress={onRepublicar} cargando={ocupado} />
          )}
          <Icono nombre="chevronDerecha" tamano={20} color={COLORES.textoSecundario} />
        </View>
      )}
    </Pressable>
  );
}
