import { View } from 'react-native';

import { CampoTexto } from '@/components/formulario/CampoTexto';
import { FilaInterruptor } from '@/components/ui/FilaInterruptor';
import { TEXTOS_PUBLICAR as T } from '@/constants/constants';
import { usePublicarAdopcionStyles } from '@/css/PublicarAdopcionPage';
import type { PasoPublicarProps } from '@/interfaces';

/** Paso 3 · Salud e historia: raza, peso, vacunas, esterilización, microchip, alergias y su historia. */
export function PasoSaludPublicar({ datos: d, errores: e, onCambiar }: PasoPublicarProps) {
  const styles = usePublicarAdopcionStyles();
  return (
    <View style={styles.paso}>
      <CampoTexto etiqueta={T.raza} icono="etiqueta" value={d.raza} onChangeText={(v) => onCambiar('raza', v)} placeholder={T.razaPlaceholder} maxLength={60} />
      <CampoTexto etiqueta={T.peso} icono="balanza" value={d.pesoKg} onChangeText={(v) => onCambiar('pesoKg', v)} keyboardType="decimal-pad" error={e.pesoKg} maxLength={5} />
      <View style={styles.interruptores}>
        <FilaInterruptor texto={T.vacunas} valor={d.vacunasAlDia} onCambiar={(v) => onCambiar('vacunasAlDia', v)} />
        <FilaInterruptor texto={T.esterilizado} valor={d.esterilizado} onCambiar={(v) => onCambiar('esterilizado', v)} />
        <FilaInterruptor texto={T.microchip} valor={d.conMicrochip} onCambiar={(v) => onCambiar('conMicrochip', v)} />
      </View>
      <CampoTexto etiqueta={T.alergias} icono="alerta" value={d.alergias} onChangeText={(v) => onCambiar('alergias', v)} maxLength={200} />
      <CampoTexto
        etiqueta={T.historia}
        icono="ficha"
        value={d.historia}
        onChangeText={(v) => onCambiar('historia', v)}
        placeholder={T.historiaPlaceholder}
        multiline
        maxLength={1000}
        error={e.historia}
      />
    </View>
  );
}
