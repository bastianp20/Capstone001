import { Pressable, Text, View } from 'react-native';

import { AvatarPersona } from '@/components/ui/AvatarPersona';
import { Icono } from '@/components/ui/Icono';
import { TEXTOS_FOTO_PERFIL } from '@/constants/constants';
import { useCabeceraPerfilStyles } from '@/css/PerfilPage';
import type { CabeceraPerfilProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Foto (o iniciales) montada sobre la onda, con el botón de cámara; nombre y correo. */
export function CabeceraPerfil({ nombre, correo, fotoUrl, onCambiarFoto }: CabeceraPerfilProps) {
  const COLORES = useColores();
  const styles = useCabeceraPerfilStyles();
  return (
    <View style={styles.contenedor}>
      <Pressable onPress={onCambiarFoto} accessibilityRole="button" accessibilityLabel={TEXTOS_FOTO_PERFIL.cambiar} style={styles.foto}>
        <View style={styles.marco}>
          <AvatarPersona nombre={nombre} fotoUrl={fotoUrl} tamano={92} />
        </View>
        <View style={styles.camara}>
          <Icono nombre="camara" tamano={16} color={COLORES.blanco} grosor={2.2} />
        </View>
      </Pressable>
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.correo}>{correo}</Text>
    </View>
  );
}
