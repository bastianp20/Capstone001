import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { MotivoConsulta } from '@/components/atencion/MotivoConsulta';
import { PildoraEnConsulta } from '@/components/atencion/PildoraEnConsulta';
import { TarjetaAccionAtencion } from '@/components/atencion/TarjetaAccionAtencion';
import { TarjetaPacienteAtencion } from '@/components/atencion/TarjetaPacienteAtencion';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TEXTOS_ATENCION as T } from '@/constants/constants';
import { atencionStyles as styles } from '@/css/AtencionPage';
import { useAtencion } from '@/hooks/useAtencion';

/** La consulta en curso: el paciente, el motivo y las 3 acciones (registrar, receta, derivar). */
export default function AtencionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = useAtencion(Number(id));

  if (a.cargando) {
    return (
      <PantallaFormulario titulo={T.titulo}>
        <EstadoCarga />
      </PantallaFormulario>
    );
  }

  if (!a.cita || !a.enCurso) {
    return (
      <PantallaFormulario titulo={T.titulo}>
        <EstadoVacio icono="citas" titulo={T.noEncontrada} textoAccion={T.volverAgenda} onAccion={() => router.back()} />
      </PantallaFormulario>
    );
  }

  return (
    <PantallaFormulario
      titulo={T.tituloCorto}
      accion={<PildoraEnConsulta minutos={a.minutos} />}
      pie={
        <View style={styles.pie}>
          <MensajeFormulario tipo="error" texto={a.error} />
          <BotonPrincipal texto={T.terminar} textoCargando={T.terminando} cargando={a.terminando} onPress={a.terminar} tono="coral" />
        </View>
      }>
      <View style={styles.cuerpo}>
        <TarjetaPacienteAtencion
          nombre={a.cita.mascota}
          descripcion={a.descripcion}
          dueno={a.dueno}
          fotoUrl={a.mascota?.fotoUrl ?? a.cita.fotoUrl}
          alergias={a.mascota?.alergias ?? a.cita.alergias}
        />
        <MotivoConsulta motivo={a.cita.motivo} sintomas={a.cita.sintomas} />
        <Text style={styles.titulo}>{T.queHacer}</Text>
        <View style={styles.acciones}>
          <TarjetaAccionAtencion icono="ficha" tono="menta" titulo={T.registrar} detalle={T.registrarDetalle} hecho={a.progreso.registro} onPress={a.irARegistro} />
          <TarjetaAccionAtencion icono="pastilla" tono="lavanda" titulo={T.receta} detalle={T.recetaDetalle(a.progreso.medicamentos)} hecho={a.progreso.medicamentos > 0} onPress={a.irAReceta} />
          <TarjetaAccionAtencion icono="derivacion" tono="durazno" titulo={T.derivar} detalle={a.progreso.derivada ? T.derivada : T.derivarDetalle} hecho={a.progreso.derivada} onPress={a.irADerivar} />
        </View>
        <Text style={styles.seGuarda}>{T.seGuarda}</Text>
      </View>
    </PantallaFormulario>
  );
}
