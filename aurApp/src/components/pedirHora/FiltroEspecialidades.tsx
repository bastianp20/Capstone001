import { Pressable, Text, View } from 'react-native';

import { ChipIcono } from '@/components/ui/ChipIcono';
import { TEXTOS_PEDIR_HORA as T } from '@/constants/constants';
import { useFiltroEspecialidadesStyles } from '@/css/PedirHoraPage';
import type { FiltroEspecialidadesProps } from '@/interfaces';
import { iconoEspecialidad } from '@/lib/especialidades';

/** "¿Qué necesita tu mascota?" (o "¿Qué especialidad necesita?" al derivar): chips de especialidades y "Quitar filtro". */
export function FiltroEspecialidades({ especialidades, seleccion, onAlternar, onQuitar, titulo = T.queNecesita, ayuda = T.queNecesitaAyuda }: FiltroEspecialidadesProps) {
  const styles = useFiltroEspecialidadesStyles();
  if (!especialidades.length) return null;
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.ayuda}>{ayuda}</Text>
      <View style={styles.chips}>
        {especialidades.map((e) => (
          <ChipIcono key={e.id} texto={e.nombre} icono={iconoEspecialidad(e.nombre)} activo={seleccion.includes(e.id)} onPress={() => onAlternar(e.id)} />
        ))}
        {seleccion.length > 0 && (
          <Pressable onPress={onQuitar} accessibilityRole="button" style={styles.quitar}>
            <Text style={styles.quitarTexto}>{T.quitarFiltro}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
