import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { AvatarPersona } from '@/components/ui/AvatarPersona';
import { HojaInferior } from '@/components/ui/HojaInferior';
import { OpcionHoja } from '@/components/ui/OpcionHoja';
import { COLORES, TEXTOS_FOTO_PERFIL as T } from '@/constants/constants';
import { hojaFotoPerfilStyles as styles } from '@/css/PerfilPage';
import type { HojaFotoPerfilProps } from '@/interfaces';

/** Hoja "Foto de perfil": vista previa, tomar, elegir de la galería o quitar. */
export function HojaFotoPerfil({ visible, nombre, fotoUrl, ocupado, error, onTomar, onElegir, onQuitar, onCerrar }: HojaFotoPerfilProps) {
  return (
    <HojaInferior visible={visible} titulo={T.titulo} onCerrar={onCerrar}>
      <View style={styles.vista}>
        <AvatarPersona nombre={nombre} fotoUrl={fotoUrl} tamano={88} />
        {ocupado && (
          <View style={styles.cargando}>
            <ActivityIndicator color={COLORES.blanco} />
          </View>
        )}
      </View>
      <View style={styles.fila}>
        <OpcionHoja icono="camara" texto={T.tomar} tono="menta" onPress={onTomar} deshabilitada={ocupado} />
        <OpcionHoja icono="imagen" texto={T.elegir} tono="lavanda" onPress={onElegir} deshabilitada={ocupado} />
      </View>
      {fotoUrl && <OpcionHoja icono="papelera" texto={T.quitar} tono="peligro" onPress={onQuitar} deshabilitada={ocupado} />}
      <MensajeFormulario tipo="error" texto={error} />
      <Text style={styles.ayuda}>{ocupado ? T.guardando : T.ayuda}</Text>
      <Pressable onPress={onCerrar} disabled={ocupado} accessibilityRole="button" style={styles.cancelar}>
        <Text style={styles.cancelarTexto}>{T.cancelar}</Text>
      </Pressable>
    </HojaInferior>
  );
}
