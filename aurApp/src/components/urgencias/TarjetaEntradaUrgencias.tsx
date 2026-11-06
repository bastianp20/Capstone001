import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Icono } from '@/components/ui/Icono';
import { TEXTOS_URGENCIAS as T } from '@/constants/constants';
import { useEntradaUrgenciasStyles } from '@/css/UrgenciasPage';
import { useColores } from '@/context/TemaContext';

/** "¿Tu mascota tiene una urgencia?" → Urgencias (se ve sin cuenta). Va en el login y en el inicio del dueño. */
export function TarjetaEntradaUrgencias() {
  const COLORES = useColores();
  const styles = useEntradaUrgenciasStyles();
  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <Icono nombre="alerta" tamano={20} color={COLORES.peligro} />
        <Text style={styles.titulo}>{T.tarjetaTitulo}</Text>
      </View>
      <Text style={styles.texto}>{T.tarjetaTexto}</Text>
      <View style={styles.boton}>
        <BotonPequeno texto={T.tarjetaBoton} icono="telefono" variante="peligro" onPress={() => router.push('/urgencias')} />
      </View>
    </View>
  );
}
