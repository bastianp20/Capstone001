import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { AvisarCambio } from '@/components/agenda/AvisarCambio';
import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { CampoHora } from '@/components/ui/CampoHora';
import { Casilla } from '@/components/ui/Casilla';
import { ChipsOpcion } from '@/components/ui/ChipsOpcion';
import { FilaInterruptor } from '@/components/ui/FilaInterruptor';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { ResultadoSolicitud } from '@/components/ui/ResultadoSolicitud';
import { MOTIVOS_CAMBIO_HORA, TEXTOS_CAMBIO_HORA as T } from '@/constants/constants';
import { useCambioHoraStyles } from '@/css/MiAgendaPage';
import { useBloquearHorario } from '@/hooks/useBloquearHorario';
import type { ParametrosBloqueo } from '@/interfaces';
import { describirCita } from '@/lib/cambioHora';
import { formatFechaLarga, hoy } from '@/lib/fechas';

/** Agenda → tocar una hora libre → bloquear ese rango (o el día). Si tiene citas, se pueden cancelar avisando. */
export default function BloquearHorarioScreen() {
  const styles = useCambioHoraStyles();
  const p = useLocalSearchParams<Partial<Record<keyof ParametrosBloqueo, string>>>();
  const b = useBloquearHorario({ fecha: p.fecha ?? hoy(), desde: p.desde ?? '09:00', hasta: p.hasta ?? '10:00' });

  if (b.listo) {
    return (
      <PantallaFormulario titulo={T.tituloBloquear}>
        <ResultadoSolicitud titulo={T.listo} detalle={T.bloqueado} textoBoton={T.volverAgenda} onPress={router.back} />
      </PantallaFormulario>
    );
  }

  return (
    <PantallaFormulario
      titulo={T.tituloBloquear}
      subtitulo={formatFechaLarga(b.fecha)}
      pie={
        <View style={styles.pie}>
          <MensajeFormulario tipo="error" texto={b.error} />
          <BotonPrincipal
            texto={b.cancela ? T.confirmarBloquearYCancelar : T.confirmarBloquear}
            textoCargando={T.guardando}
            tono={b.cancela ? 'peligro' : 'primario'}
            cargando={b.guardando}
            deshabilitado={!b.puedeGuardar}
            onPress={b.guardar}
          />
        </View>
      }>
      <View style={styles.cuerpo}>
        <Text style={styles.ayuda}>{T.bajadaBloquear}</Text>

        <View style={styles.seccion}>
          <FilaInterruptor texto={T.todoElDia} valor={b.todoElDia} onCambiar={b.setTodoElDia} />
          {!b.todoElDia && (
            <View style={styles.fila}>
              <View style={styles.mitad}><CampoHora etiqueta={T.desde} valor={b.desde} onCambiar={b.setDesde} /></View>
              <View style={styles.mitad}><CampoHora etiqueta={T.hasta} valor={b.hasta} onCambiar={b.setHasta} /></View>
            </View>
          )}
          {!b.rangoValido && <MensajeFormulario tipo="error" texto={T.rangoInvalido} />}
        </View>

        <View style={styles.seccion}>
          <Text style={styles.etiqueta}>{T.motivo}</Text>
          <ChipsOpcion opciones={MOTIVOS_CAMBIO_HORA} valor={b.motivo} onCambiar={b.setMotivo} />
        </View>

        {b.afectadas.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.avisoAmbar}>{T.citasEnRango(b.afectadas.length)}</Text>
            {b.afectadas.map((c) => <Text key={c.id} style={styles.citaAfectada}>{`${describirCita(c)} · ${c.dueno}`}</Text>)}
            <Casilla texto={T.cancelarCitas} marcada={b.cancelarCitas} onCambiar={b.setCancelarCitas} />
            {!b.cancelarCitas && <Text style={styles.ayuda}>{T.ayudaReagendar}</Text>}
          </View>
        )}

        {b.cancela && (
          <AvisarCambio dueno={[...new Set(b.afectadas.map((c) => c.dueno))].join(', ')} centros={b.centros}
            avisarCentro={b.avisarCentro} onAvisarCentro={b.setAvisarCentro} mensaje={b.mensaje} onMensaje={b.setMensaje} />
        )}
      </View>
    </PantallaFormulario>
  );
}
