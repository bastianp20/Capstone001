import { Text, TextInput, View } from 'react-native';

import { Casilla } from '@/components/ui/Casilla';
import { Icono } from '@/components/ui/Icono';
import { MAX_CARACTERES_AVISO, TEXTOS_CAMBIO_HORA as T } from '@/constants/constants';
import { useCambioHoraStyles } from '@/css/MiAgendaPage';
import type { AvisarCambioProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** "¿A quién avisamos?": el dueño siempre; el centro, si se marca. Más el mensaje que les llega. */
export function AvisarCambio({ dueno, centros, avisarCentro, onAvisarCentro, mensaje, onMensaje }: AvisarCambioProps) {
  const COLORES = useColores();
  const styles = useCambioHoraStyles();
  return (
    <View style={styles.seccion}>
      <Text style={styles.etiqueta}>{T.aQuienAvisamos}</Text>
      <View style={styles.destinatario}>
        <Icono nombre="persona" tamano={18} color={COLORES.primario} />
        <Text style={styles.destinatarioTexto}>{T.dueno(dueno)}</Text>
      </View>
      <Text style={styles.ayuda}>{T.siempreDueno}</Text>
      {centros.length > 0 && <Casilla texto={T.centro(centros.join(', '))} marcada={avisarCentro} onCambiar={onAvisarCentro} />}

      <Text style={styles.etiqueta}>{T.mensaje}</Text>
      <TextInput
        style={styles.mensaje}
        value={mensaje}
        onChangeText={onMensaje}
        multiline
        maxLength={MAX_CARACTERES_AVISO}
        accessibilityLabel={T.mensaje}
        placeholderTextColor={COLORES.textoSecundario}
      />
    </View>
  );
}
