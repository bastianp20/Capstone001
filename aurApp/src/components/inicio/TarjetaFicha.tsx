import { Text, View } from 'react-native';

import { AnilloProgreso } from '@/components/ui/AnilloProgreso';
import { Icono } from '@/components/ui/Icono';
import { TarjetaPastel } from '@/components/ui/TarjetaPastel';
import { TEXTOS_INICIO, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaFichaStyles as styles } from '@/css/InicioPage';
import type { TarjetaFichaProps } from '@/interfaces';

const TAMANO_ANILLO = 96;

/** Qué tan completa está la ficha de la mascota; al tocarla se abre para completarla. */
export function TarjetaFicha({ nombreMascota, porcentaje, resumen, onPress }: TarjetaFichaProps) {
  const tono = TONOS_TARJETA.menta;
  const completa = porcentaje === 100;

  return (
    <TarjetaPastel tono="menta" onPress={onPress} style={styles.tarjeta}>
      <Text style={styles.titulo} numberOfLines={2}>
        {TEXTOS_INICIO.fichaDe} {nombreMascota}
      </Text>

      <View style={styles.anillo}>
        <AnilloProgreso porcentaje={porcentaje} tamano={TAMANO_ANILLO} grosor={10} color={tono.icono} colorFondo={tono.iconoFondo} />
        <View style={styles.centroAnillo}>
          <Text style={styles.porcentaje}>{porcentaje}%</Text>
        </View>
      </View>

      <View style={styles.resumen}>
        <Icono nombre={completa ? 'escudo' : 'editar'} tamano={15} color={tono.icono} grosor={2.2} />
        <Text style={styles.textoResumen} numberOfLines={2}>
          {resumen}
        </Text>
      </View>
    </TarjetaPastel>
  );
}
