import { Text, View } from 'react-native';

import { AvatarIniciales } from '@/components/ui/AvatarIniciales';
import { cabeceraPerfilStyles as styles } from '@/css/PerfilPage';
import type { CabeceraPerfilProps } from '@/interfaces';

/** Avatar con iniciales (montado sobre la onda), nombre y correo. */
export function CabeceraPerfil({ nombre, correo }: CabeceraPerfilProps) {
  return (
    <View style={styles.contenedor}>
      <AvatarIniciales nombre={nombre} tamano={92} />
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.correo}>{correo}</Text>
    </View>
  );
}
