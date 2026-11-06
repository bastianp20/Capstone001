import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TarjetaDestinoDerivacion } from '@/components/atencion/TarjetaDestinoDerivacion';
import { FiltroEspecialidades } from '@/components/pedirHora/FiltroEspecialidades';
import { AvisoSinConexion } from '@/components/ui/AvisoSinConexion';
import { ControlSegmentado } from '@/components/ui/ControlSegmentado';
import { EstadoBorrador } from '@/components/ui/EstadoBorrador';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { MODOS_DERIVACION, TEXTOS_CARGA, TEXTOS_DERIVAR_ATENCION as T } from '@/constants/constants';
import { useDerivarStyles } from '@/css/DerivarPage';
import { useDerivarPaciente } from '@/hooks/useDerivarPaciente';

/** Derivar al paciente: filtrar por especialidad, elegir colega o centro y escribir el motivo. */
export default function DerivarPacienteScreen() {
  const styles = useDerivarStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = useDerivarPaciente(Number(id));
  const subtitulo = [d.cita?.mascota, d.cita?.raza].filter(Boolean).join(' · ');

  return (
    <PantallaFormulario
      titulo={T.titulo}
      subtitulo={subtitulo}
      pie={
        <View style={styles.pie}>
          {!d.sinConexion && <MensajeFormulario tipo="error" texto={d.error} />}
          <EstadoBorrador guardadoEn={d.guardadoEn} />
          <BotonPrincipal texto={T.enviar} textoCargando={T.enviando} cargando={d.enviando} onPress={d.enviar} tono="coral" />
        </View>
      }>
      <View style={styles.cuerpo}>
        <AvisoSinConexion visible={d.sinConexion} reintentando={d.enviando} onReintentar={d.enviar} />
        <FiltroEspecialidades {...d.filtro} titulo={T.queEspecialidad} ayuda={T.queEspecialidadAyuda} />
        <ControlSegmentado opciones={MODOS_DERIVACION} valor={d.modo} onCambiar={d.setModo} />
        {d.cargando ? (
          <EstadoCarga texto={T.cargando} />
        ) : d.errorCarga ? (
          <EstadoVacio icono="cancelar" titulo={T.errorCarga} textoAccion={TEXTOS_CARGA.reintentar} onAccion={d.recargar} />
        ) : d.visibles.length === 0 ? (
          <EstadoVacio icono="buscar" titulo={d.filtro.seleccion.length ? T.sinCoincidencias : T.sinDestinos} />
        ) : (
          <>
            <Text style={styles.resumen}>{d.resumen}</Text>
            <View style={styles.lista} accessibilityRole="radiogroup">
              {d.visibles.map((x) => (
                <TarjetaDestinoDerivacion key={x.clave} destino={x} seleccionado={x.clave === d.elegidoClave} onPress={() => d.elegir(x.clave)} />
              ))}
            </View>
          </>
        )}
        <CampoTexto etiqueta={T.motivo} icono="mensaje" value={d.motivo} onChangeText={d.setMotivo} placeholder={T.motivoPlaceholder} multiline maxLength={500} />
      </View>
    </PantallaFormulario>
  );
}
