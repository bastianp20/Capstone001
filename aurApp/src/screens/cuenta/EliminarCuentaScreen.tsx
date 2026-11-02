import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { BotonSecundario } from '@/components/formulario/BotonSecundario';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { FormularioEliminarCuenta } from '@/components/cuenta/FormularioEliminarCuenta';
import { SolicitudEliminacionEnviada } from '@/components/cuenta/SolicitudEliminacionEnviada';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TEXTOS_ELIMINAR_CUENTA as T } from '@/constants/constants';
import { eliminarCuentaStyles as styles } from '@/css/CuentaPage';
import { useEliminarCuenta } from '@/hooks/useEliminarCuenta';

/** Perfil → "Eliminar mi cuenta": pedirla o, si ya la pidió, verla en revisión y poder cancelarla. */
export default function EliminarCuentaScreen() {
  const e = useEliminarCuenta();

  if (e.cargando) {
    return (
      <PantallaFormulario titulo={T.titulo}>
        <EstadoCarga texto={T.cargando} />
      </PantallaFormulario>
    );
  }

  if (e.pendiente) {
    return (
      <PantallaFormulario
        titulo={T.titulo}
        pie={
          <View style={styles.pie}>
            <MensajeFormulario tipo="error" texto={e.error} />
            <BotonSecundario texto={e.ocupado ? T.cancelando : T.cancelarSolicitud} tono="verde" cargando={e.ocupado} onPress={e.cancelar} />
            <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.enlace}>
              <Text style={styles.enlaceNeutro}>{T.volverPerfil}</Text>
            </Pressable>
          </View>
        }>
        <SolicitudEliminacionEnviada correo={e.correo} creadaEn={e.pendiente.creadaEn} />
      </PantallaFormulario>
    );
  }

  return (
    <PantallaFormulario
      titulo={T.titulo}
      pie={
        <View style={styles.pie}>
          <MensajeFormulario tipo="error" texto={e.error} />
          <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.enlace}>
            <Text style={styles.enlaceVerde}>{T.mejorMeQuedo}</Text>
          </Pressable>
          <BotonPrincipal
            texto={T.solicitar}
            textoCargando={T.solicitando}
            cargando={e.ocupado}
            deshabilitado={!e.entiende}
            tono="peligro"
            onPress={e.enviar}
          />
        </View>
      }>
      <FormularioEliminarCuenta
        motivos={e.motivos}
        onMotivo={e.alternarMotivo}
        comentario={e.comentario}
        onComentario={e.setComentario}
        entiende={e.entiende}
        onEntiende={e.setEntiende}
        rechazoAnterior={e.rechazoAnterior}
      />
    </PantallaFormulario>
  );
}
