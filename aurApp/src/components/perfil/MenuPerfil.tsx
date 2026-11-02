import { View } from 'react-native';

import { FilaOpcion } from '@/components/ui/FilaOpcion';
import { TEXTOS_PERFIL } from '@/constants/constants';
import { menuPerfilStyles as styles } from '@/css/PerfilPage';
import type { MenuPerfilProps } from '@/interfaces';

export function MenuPerfil({ onDatosPersonales, onAyuda, opcionesExtra, onEliminarCuenta, onAdopcion, onMisPublicaciones, misRefugios = [], onMiRefugio }: MenuPerfilProps) {
  return (
    <View style={styles.tarjeta}>
      {opcionesExtra}
      {onAdopcion && <FilaOpcion icono="corazon" tono="durazno" texto={TEXTOS_PERFIL.adopcion} onPress={onAdopcion} />}
      <FilaOpcion icono="casa" tono="crema" texto={TEXTOS_PERFIL.misPublicaciones} onPress={onMisPublicaciones} />
      {onMiRefugio &&
        misRefugios.map((r) => (
          // Con un solo refugio dice "Mi refugio"; con varios, el nombre de cada uno
          <FilaOpcion key={r.id} icono="casa" tono="menta" texto={misRefugios.length === 1 ? TEXTOS_PERFIL.miRefugio : r.nombre} onPress={() => onMiRefugio(r.id)} />
        ))}
      <FilaOpcion icono="ficha" tono="menta" texto={TEXTOS_PERFIL.datosPersonales} onPress={onDatosPersonales} />
      <FilaOpcion icono="ayuda" tono="lavanda" texto={TEXTOS_PERFIL.ayuda} onPress={onAyuda} ultima={!onEliminarCuenta} />
      {onEliminarCuenta && <FilaOpcion icono="papelera" tono="durazno" texto={TEXTOS_PERFIL.eliminarCuenta} onPress={onEliminarCuenta} ultima />}
    </View>
  );
}
