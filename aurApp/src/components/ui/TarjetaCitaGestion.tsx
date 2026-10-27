import { Pressable, Text, View } from 'react-native';

import { COLORES, ETIQUETAS_ESTADO_CITA, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaCitaGestionStyles as styles } from '@/css/Compartido';
import type { TarjetaCitaGestionProps } from '@/interfaces';
import { formatFechaHoraCita, partesFechaCita } from '@/lib/fechas';

import { AvatarMascota } from './AvatarMascota';
import { Etiqueta } from './Etiqueta';
import { Icono } from './Icono';

/** Cita vista por quien atiende (veterinario o centro): mascota, dueño, motivo, estado y acciones. */
export function TarjetaCitaGestion({
  mascota,
  fotoMascota = null,
  descripcionMascota,
  dueno,
  fechaHora,
  soloHora,
  motivo,
  estado,
  sintomas = [],
  extra,
  alerta,
  tono,
  acciones,
  onPress,
}: TarjetaCitaGestionProps) {
  const colorEstado = COLORES.estados[estado];
  const fondo = tono ? { backgroundColor: TONOS_TARJETA[tono].fondo, borderColor: TONOS_TARJETA[tono].iconoFondo } : null;

  const contenido = (
    <>
      <View style={styles.cabecera}>
        <AvatarMascota nombre={mascota} fotoUrl={fotoMascota} tamano={40} tono={tono ?? 'menta'} />
        <View style={styles.textos}>
          <Text style={styles.mascota} numberOfLines={1}>
            {mascota}
            {descripcionMascota ? <Text style={styles.descripcion}> · {descripcionMascota}</Text> : null}
          </Text>
          <Text style={styles.dueno} numberOfLines={1}>
            {dueno}
          </Text>
        </View>
        <Text style={styles.hora}>{soloHora ? partesFechaCita(fechaHora).hora : formatFechaHoraCita(fechaHora)}</Text>
      </View>

      <Text style={styles.motivo}>{motivo}</Text>
      {extra ? <Text style={styles.extra}>{extra}</Text> : null}

      <View style={styles.etiquetas}>
        <Etiqueta texto={ETIQUETAS_ESTADO_CITA[estado]} colorFondo={colorEstado.fondo} colorTexto={colorEstado.texto} conPunto />
        {alerta ? <Etiqueta texto={alerta} icono="alerta" colorFondo={COLORES.estados.pendiente.fondo} colorTexto={COLORES.estados.pendiente.texto} /> : null}
        {sintomas.map((s) => (
          <Etiqueta key={s} texto={s} colorFondo="rgba(255,255,255,0.75)" colorTexto={COLORES.texto} />
        ))}
      </View>

      {acciones ? <View style={styles.acciones}>{acciones}</View> : null}
      {onPress && !acciones ? (
        <View style={styles.flecha}>
          <Icono nombre="chevronDerecha" tamano={18} color={COLORES.textoSecundario} />
        </View>
      ) : null}
    </>
  );

  if (!onPress) return <View style={[styles.tarjeta, fondo]}>{contenido}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tarjeta, fondo, pressed && styles.presionada]}>
      {contenido}
    </Pressable>
  );
}
