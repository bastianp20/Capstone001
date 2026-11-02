import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { PasoDatosPublicar } from '@/components/adopcion/publicar/PasoDatosPublicar';
import { PasoPersonalidadPublicar } from '@/components/adopcion/publicar/PasoPersonalidadPublicar';
import { PasoSaludPublicar } from '@/components/adopcion/publicar/PasoSaludPublicar';
import { VistaPreviaPublicacion } from '@/components/adopcion/publicar/VistaPreviaPublicacion';
import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { HojaElegirFoto } from '@/components/ui/HojaElegirFoto';
import { IndicadorPasos } from '@/components/ui/IndicadorPasos';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { ResultadoSolicitud } from '@/components/ui/ResultadoSolicitud';
import { PASOS_PUBLICAR, TEXTOS_PUBLICAR as T } from '@/constants/constants';
import { publicarAdopcionStyles as styles } from '@/css/PublicarAdopcionPage';
import { usePublicarAdopcion } from '@/hooks/usePublicarAdopcion';

/** "Dar en adopción" en 4 pasos: Datos (con fotos de la cámara o la galería) · Personalidad · Salud · Revisar. */
export default function PublicarAdopcionScreen() {
  const { refugio } = useLocalSearchParams<{ refugio?: string }>();
  const p = usePublicarAdopcion(refugio ? Number(refugio) : null);

  if (p.publicadaId !== null) {
    const id = p.publicadaId;
    return (
      <PantallaFormulario titulo={T.titulo}>
        <ResultadoSolicitud titulo={T.listoTitulo(p.datos.nombre.trim())} detalle={T.listoTexto} textoBoton={T.verPublicacion} onPress={() => router.replace(`/adopcion/${id}`)} />
      </PantallaFormulario>
    );
  }

  const pasoProps = { datos: p.datos, errores: p.errores, onCambiar: p.cambiar };
  return (
    <PantallaFormulario
      titulo={T.titulo}
      onVolver={p.esPrimero ? router.back : p.volver}
      pie={
        <View style={styles.pie}>
          <MensajeFormulario tipo="error" texto={p.error} />
          {p.esUltimo ? (
            <BotonPrincipal texto={T.publicar} textoCargando={T.publicando} cargando={p.publicando} onPress={p.publicar} tono="coral" />
          ) : (
            <BotonPrincipal texto={T.continuar} onPress={p.continuar} tono="coral" conFlecha />
          )}
        </View>
      }>
      <IndicadorPasos pasos={PASOS_PUBLICAR} actual={p.paso} />
      {p.paso === 0 && <PasoDatosPublicar {...pasoProps} misRefugios={p.misRefugios} onAgregarFoto={p.fotos.abrir} onQuitarFoto={p.quitarFoto} />}
      {p.paso === 1 && <PasoPersonalidadPublicar {...pasoProps} onAlternarPersonalidad={p.alternarPersonalidad} />}
      {p.paso === 2 && <PasoSaludPublicar {...pasoProps} />}
      {p.paso === 3 && <VistaPreviaPublicacion datos={p.datos} nombreRefugio={p.nombreRefugio} />}
      <HojaElegirFoto visible={p.fotos.hojaAbierta} titulo={T.hojaFoto} onTomar={p.fotos.tomar} onElegir={p.fotos.elegir} onCerrar={p.fotos.cerrar} />
    </PantallaFormulario>
  );
}
