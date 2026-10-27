import { Text, View } from 'react-native';

import { AvatarIniciales } from '@/components/ui/AvatarIniciales';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { TEXTOS_EQUIPO, TONOS_TARJETA } from '@/constants/constants';
import { filaMiembroStyles as styles } from '@/css/CentroPage';
import type { FilaMiembroProps } from '@/interfaces';
import { nombrePropio } from '@/lib/texto';

export function FilaMiembro({ miembro, ultima }: FilaMiembroProps) {
  const esVet = miembro.tipo === 'veterinario';
  const tono = TONOS_TARJETA[esVet ? 'menta' : 'lavanda'];
  return (
    <View style={[styles.fila, !ultima && styles.separador]}>
      <AvatarIniciales nombre={nombrePropio(miembro.nombre)} tamano={44} />
      <View style={styles.textos}>
        <Text style={styles.nombre} numberOfLines={1}>
          {nombrePropio(miembro.nombre)}
        </Text>
        <Text style={styles.detalle} numberOfLines={1}>
          {miembro.detalle}
        </Text>
      </View>
      <Etiqueta texto={esVet ? TEXTOS_EQUIPO.veterinario : TEXTOS_EQUIPO.admin} colorFondo={tono.fondo} colorTexto={tono.icono} />
    </View>
  );
}
