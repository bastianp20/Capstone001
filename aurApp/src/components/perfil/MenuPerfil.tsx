import { View } from 'react-native';

import { FilaOpcion } from '@/components/ui/FilaOpcion';
import { TEXTOS_PERFIL } from '@/constants/constants';
import { menuPerfilStyles as styles } from '@/css/PerfilPage';
import type { MenuPerfilProps } from '@/interfaces';

export function MenuPerfil({ onDatosPersonales, onAyuda, opcionesExtra }: MenuPerfilProps) {
  return (
    <View style={styles.tarjeta}>
      {opcionesExtra}
      <FilaOpcion icono="ficha" tono="menta" texto={TEXTOS_PERFIL.datosPersonales} onPress={onDatosPersonales} />
      <FilaOpcion icono="ayuda" tono="lavanda" texto={TEXTOS_PERFIL.ayuda} onPress={onAyuda} ultima />
    </View>
  );
}
