import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarIniciales } from '@/components/ui/AvatarIniciales';
import { EncabezadoVerde } from '@/components/ui/EncabezadoVerde';
import { HUELLAS_ENCABEZADO_INICIO, MARGEN_PANTALLA, TEXTOS_INICIO } from '@/constants/constants';
import { encabezadoInicioStyles as styles } from '@/css/InicioPage';
import type { EncabezadoInicioProps } from '@/interfaces';

import { FotoMascota } from './FotoMascota';
import { SelectorMascotas } from './SelectorMascotas';
import { TarjetaProximaCita } from './TarjetaProximaCita';

const PROPORCION_COLUMNA_FOTO = 0.42;

export function EncabezadoInicio({
  nombreUsuario,
  nombreCompleto,
  mascotas,
  mascota,
  resumen,
  onSeleccionarMascota,
  onAgregarMascota,
  onIrAPerfil,
  onVerCita,
}: EncabezadoInicioProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const diametroFoto = (width - MARGEN_PANTALLA * 2) * PROPORCION_COLUMNA_FOTO;

  return (
    <EncabezadoVerde huellas={HUELLAS_ENCABEZADO_INICIO} style={[styles.contenedor, { paddingTop: insets.top + 10 }]}>
      <View style={styles.filaSuperior}>
        <Text style={styles.saludo} numberOfLines={1}>
          {TEXTOS_INICIO.saludo}, {nombreUsuario}
        </Text>
        <Pressable onPress={onIrAPerfil} accessibilityRole="button" accessibilityLabel={TEXTOS_INICIO.irAPerfil} hitSlop={8}>
          <AvatarIniciales nombre={nombreCompleto} tamano={44} />
        </Pressable>
      </View>

      <View style={styles.filaPrincipal}>
        <View style={[styles.columnaFoto, { width: diametroFoto }]}>
          <FotoMascota key={mascota.id} mascota={mascota} diametro={diametroFoto} />
        </View>

        <View style={styles.columnaInfo}>
          <Text style={styles.nombre} numberOfLines={1}>
            {mascota.nombre}
          </Text>
          <Text style={styles.detalle} numberOfLines={2}>
            {resumen.descripcion}
          </Text>

          <SelectorMascotas
            mascotas={mascotas}
            idSeleccionada={mascota.id}
            onSeleccionar={onSeleccionarMascota}
            onAgregar={onAgregarMascota}
          />

          <TarjetaProximaCita cita={resumen.proximaCita} onPress={onVerCita} style={styles.tarjetaCita} />
        </View>
      </View>
    </EncabezadoVerde>
  );
}
