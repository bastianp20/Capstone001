import { Text, View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { FilaInterruptor } from '@/components/ui/FilaInterruptor';
import { TEXTOS_HORARIO_CENTRO, TEXTOS_URGENCIAS_CENTRO as T } from '@/constants/constants';
import { useUrgenciasCentroStyles } from '@/css/UrgenciasCentroPage';
import { useUrgenciasCentro } from '@/hooks/useUrgenciasCentro';
import type { TarjetaUrgenciasCentroProps } from '@/interfaces';

/** "Urgencias y UCI": si tienen UCI y si atienden 24/7 (24/7 deja el horario completo, sin editar). */
export function TarjetaUrgenciasCentro({ centro, onGuardado }: TarjetaUrgenciasCentroProps) {
  const styles = useUrgenciasCentroStyles();
  const u = useUrgenciasCentro(centro, onGuardado);
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>{T.titulo}</Text>
      <Text style={styles.ayuda}>{T.bajada}</Text>
      <FilaInterruptor texto={T.tieneUci} valor={u.tieneUci} onCambiar={u.setTieneUci} />
      <FilaInterruptor texto={T.urgencias247} valor={u.urgencias247} onCambiar={u.setUrgencias247} />
      {u.urgencias247 && <Text style={styles.ayuda}>{TEXTOS_HORARIO_CENTRO.ayuda247}</Text>}
      <MensajeFormulario tipo="error" texto={u.error} />
      <MensajeFormulario tipo="aviso" texto={u.guardado ? T.guardado : ''} />
      {u.hayCambios && <BotonPequeno texto={T.guardar} variante="primario" onPress={u.guardar} cargando={u.ocupado} />}
    </View>
  );
}
