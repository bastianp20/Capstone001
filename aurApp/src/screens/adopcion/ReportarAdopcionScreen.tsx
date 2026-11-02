import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { GrillaMotivosReporte } from '@/components/adopcion/GrillaMotivosReporte';
import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { ResultadoSolicitud } from '@/components/ui/ResultadoSolicitud';
import { TarjetaAviso } from '@/components/ui/TarjetaAviso';
import { MAX_COMENTARIO_REPORTE, TEXTOS_REPORTE as T } from '@/constants/constants';
import { reportarAdopcionStyles as styles } from '@/css/PostularAdopcionPage';
import { useReportarAdopcion } from '@/hooks/useReportarAdopcion';

/** Reportar una publicación de adopción (piden dinero, posible estafa, animal en riesgo…). */
export default function ReportarAdopcionScreen() {
  const { id, nombre } = useLocalSearchParams<{ id: string; nombre?: string }>();
  const r = useReportarAdopcion(Number(id));
  const subtitulo = nombre ? T.subtitulo(nombre) : undefined;

  if (r.numero !== null) {
    return (
      <PantallaFormulario titulo={T.titulo} subtitulo={subtitulo}>
        <ResultadoSolicitud titulo={T.listoTitulo} detalle={T.listoTexto(r.numero)} textoBoton={T.volver} onPress={router.back} />
      </PantallaFormulario>
    );
  }

  return (
    <PantallaFormulario
      titulo={T.titulo}
      subtitulo={subtitulo}
      pie={
        <View style={styles.pie}>
          <MensajeFormulario tipo="error" texto={r.error} />
          <BotonPrincipal texto={T.enviar} textoCargando={T.enviando} cargando={r.enviando} onPress={r.enviar} tono="peligro" />
        </View>
      }>
      <View style={styles.cuerpo}>
        <Text style={styles.bajada}>{T.bajada}</Text>
        <GrupoCampo titulo={T.pregunta}>
          <GrillaMotivosReporte valor={r.motivo} onCambiar={r.elegirMotivo} />
        </GrupoCampo>
        <TarjetaAviso icono="telefono" titulo={T.emergenciaTitulo} texto={T.emergencia} />
        <CampoTexto
          etiqueta={T.comentario}
          icono="mensaje"
          value={r.comentario}
          onChangeText={r.setComentario}
          placeholder={T.comentarioPlaceholder}
          multiline
          maxLength={MAX_COMENTARIO_REPORTE}
        />
      </View>
    </PantallaFormulario>
  );
}
