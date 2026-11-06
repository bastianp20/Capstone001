import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { PasoConfirmacionPostulacion } from '@/components/adopcion/postulacion/PasoConfirmacionPostulacion';
import { PasoExperienciaPostulacion } from '@/components/adopcion/postulacion/PasoExperienciaPostulacion';
import { PasoFamiliaPostulacion } from '@/components/adopcion/postulacion/PasoFamiliaPostulacion';
import { PasoHogarPostulacion } from '@/components/adopcion/postulacion/PasoHogarPostulacion';
import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { IndicadorPasos } from '@/components/ui/IndicadorPasos';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { ResultadoSolicitud } from '@/components/ui/ResultadoSolicitud';
import { PASOS_POSTULACION, TEXTOS_POSTULACION as T } from '@/constants/constants';
import { usePostularAdopcionStyles } from '@/css/PostularAdopcionPage';
import { usePostularAdopcion } from '@/hooks/usePostularAdopcion';

/** "Quiero adoptarlo" en 4 pasos: Tu hogar · Tu familia · Experiencia · Confirmar. */
export default function PostularAdopcionScreen() {
  const styles = usePostularAdopcionStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = usePostularAdopcion(Number(id));
  const titulo = T.titulo(p.nombreAnimal);

  if (p.enviada) {
    return (
      <PantallaFormulario titulo={titulo}>
        <ResultadoSolicitud titulo={T.enviadaTitulo} detalle={T.enviadaTexto(p.quienPublica)} textoBoton={T.volverFicha} onPress={router.back} />
      </PantallaFormulario>
    );
  }

  const pasoProps = { datos: p.datos, errores: p.errores, onCambiar: p.cambiar };
  return (
    <PantallaFormulario
      titulo={titulo}
      onVolver={p.esPrimero ? router.back : p.volver}
      pie={
        <View style={styles.pie}>
          <MensajeFormulario tipo="error" texto={p.error} />
          {p.esUltimo ? (
            <BotonPrincipal texto={T.enviar} textoCargando={T.enviando} cargando={p.enviando} onPress={p.enviar} tono="coral" />
          ) : (
            <BotonPrincipal texto={T.continuar} onPress={p.continuar} tono="coral" conFlecha />
          )}
        </View>
      }>
      <IndicadorPasos pasos={PASOS_POSTULACION} actual={p.paso} />
      {p.paso === 0 && <PasoHogarPostulacion {...pasoProps} />}
      {p.paso === 1 && <PasoFamiliaPostulacion {...pasoProps} />}
      {p.paso === 2 && <PasoExperienciaPostulacion {...pasoProps} />}
      {p.paso === 3 && <PasoConfirmacionPostulacion {...pasoProps} nombreAnimal={p.nombreAnimal} />}
    </PantallaFormulario>
  );
}
