import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { AvisarCambio } from '@/components/agenda/AvisarCambio';
import { SelectorHoraLibre } from '@/components/agenda/SelectorHoraLibre';
import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { CampoHora } from '@/components/ui/CampoHora';
import { ChipsOpcion } from '@/components/ui/ChipsOpcion';
import { ControlSegmentado } from '@/components/ui/ControlSegmentado';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { ResultadoSolicitud } from '@/components/ui/ResultadoSolicitud';
import { ACCIONES_CAMBIO_CITA, MOTIVOS_CAMBIO_HORA, TEXTOS_CAMBIO_HORA as T } from '@/constants/constants';
import { useCambioHoraStyles } from '@/css/MiAgendaPage';
import { useModificarCita } from '@/hooks/useModificarCita';
import { describirCita } from '@/lib/cambioHora';
import { formatFechaHoraCita } from '@/lib/fechas';

/** Agenda → tocar una cita → reagendarla o cancelarla, avisando al dueño (y al centro si se quiere). */
export default function ModificarCitaScreen() {
  const styles = useCambioHoraStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const m = useModificarCita(Number(id));

  if (m.destinos) {
    return (
      <PantallaFormulario titulo={T.tituloModificar}>
        <ResultadoSolicitud titulo={T.listo} detalle={T.listoAvisamos(m.destinos)} textoBoton={T.volverAgenda} onPress={router.back} />
      </PantallaFormulario>
    );
  }

  const contenido = () => {
    if (m.cargando) return <EstadoCarga />;
    if (!m.cita || !m.modificable) return <EstadoVacio icono="cancelar" titulo={T.noEncontrada} />;
    const c = m.cita;
    return (
      <View style={styles.cuerpo}>
        <View style={styles.resumen}>
          <Text style={styles.resumenTitulo}>{c.mascota}</Text>
          <Text style={styles.resumenDetalle}>{`${c.dueno} · ${formatFechaHoraCita(c.fechaHora)}`}</Text>
          {c.centro && <Text style={styles.resumenDetalle}>{c.centro}</Text>}
        </View>

        <ControlSegmentado opciones={ACCIONES_CAMBIO_CITA} valor={m.tipo} onCambiar={m.cambiarTipo} />

        {m.tipo === 'reagendar' ? (
          <View style={styles.seccion}>
            {!m.manual ? (
              <>
                <Text style={styles.etiqueta}>{T.horasLibres}</Text>
                {m.libres.length
                  ? <SelectorHoraLibre horas={m.libres} elegida={m.elegida?.inicio ?? null} onElegir={m.elegir} />
                  : <Text style={styles.ayuda}>{T.sinHorasLibres}</Text>}
                <BotonPequeno texto={T.otraHora} icono="editar" onPress={() => m.setManual(true)} />
              </>
            ) : (
              <>
                <CampoTexto etiqueta={T.dia} icono="citas" value={m.dia} onChangeText={m.setDia} keyboardType="numbers-and-punctuation"
                  maxLength={10} placeholder="06-11-2026" error={m.errorDia || undefined} />
                <CampoHora etiqueta={T.hora} valor={m.hora} onCambiar={m.setHora} />
                {m.libres.length > 0 && <BotonPequeno texto={T.verHorasLibres} icono="reloj" onPress={() => m.setManual(false)} />}
              </>
            )}
            {m.nuevaFecha && <Text style={styles.antesAhora}>{T.antesAhora(formatFechaHoraCita(c.fechaHora), formatFechaHoraCita(m.nuevaFecha))}</Text>}
          </View>
        ) : (
          <View style={styles.seccion}>
            <Text style={styles.etiqueta}>{T.motivo}</Text>
            <ChipsOpcion opciones={MOTIVOS_CAMBIO_HORA} valor={m.motivo} onCambiar={m.setMotivo} />
            <CampoTexto etiqueta={T.detalle} icono="editar" value={m.detalle} onChangeText={m.setDetalle} maxLength={200} />
            <Text style={styles.avisoPeligro}>{T.avisoCancelar}</Text>
          </View>
        )}

        <AvisarCambio dueno={c.dueno} centros={m.centros} avisarCentro={m.avisarCentro} onAvisarCentro={m.setAvisarCentro}
          mensaje={m.mensaje} onMensaje={m.setMensaje} />
      </View>
    );
  };

  return (
    <PantallaFormulario
      titulo={T.tituloModificar}
      subtitulo={m.cita ? describirCita(m.cita) : undefined}
      pie={m.cita && m.modificable ? (
        <View style={styles.pie}>
          <MensajeFormulario tipo="error" texto={m.error} />
          <BotonPrincipal
            texto={m.tipo === 'reagendar' ? T.confirmarReagendar : T.confirmarCancelar}
            textoCargando={T.guardando}
            tono={m.tipo === 'cancelar' ? 'peligro' : 'primario'}
            cargando={m.guardando}
            deshabilitado={!m.puedeGuardar}
            onPress={m.guardar}
          />
        </View>
      ) : undefined}>
      {contenido()}
    </PantallaFormulario>
  );
}
