import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { CampoComunas } from '@/components/horario/CampoComunas';
import { DiasLugarHorario } from '@/components/horario/DiasLugarHorario';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { ChipsOpcion } from '@/components/ui/ChipsOpcion';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { FilaInterruptor } from '@/components/ui/FilaInterruptor';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { DURACIONES_CITA, TEXTOS_CARGA, TEXTOS_HORARIO_ATENCION as T } from '@/constants/constants';
import { useHorarioAtencionStyles } from '@/css/HorarioAtencionPage';
import { useHorarioAtencion } from '@/hooks/useHorarioAtencion';
import { claveLugar } from '@/lib/horarioAtencion';

const OPCIONES_DURACION = DURACIONES_CITA.map((m) => ({ valor: String(m), texto: T.minutos(m) }));

/** Perfil / Hoy → "Mi horario": días y horas por lugar, duración, urgencias 24/7, dónde atiende y N° de colegiado. */
export default function HorarioAtencionScreen() {
  const styles = useHorarioAtencionStyles();
  const h = useHorarioAtencion();

  const contenido = () => {
    if (h.cargando && !h.horario) return <EstadoCarga />;
    if (h.errorCarga || !h.horario) return <EstadoVacio icono="cancelar" titulo={h.errorCarga ?? TEXTOS_CARGA.error} />;
    return (
      <View style={styles.cuerpo}>
        <Text style={styles.bajada}>{T.bajada}</Text>

        {h.horario.lugares.map((lugar) => (
          <DiasLugarHorario
            key={claveLugar(lugar.centroId)}
            lugar={lugar}
            dias={h.form[claveLugar(lugar.centroId)] ?? []}
            onCambiarDia={(i, cambio) => h.cambiarDia(lugar, i, cambio)}
            onUsarHorarioCentro={() => h.usarHorarioCentro(lugar)}
          />
        ))}

        <View style={styles.tarjeta}>
          <Text style={styles.tarjetaTitulo}>{T.duracion}</Text>
          <ChipsOpcion opciones={OPCIONES_DURACION} valor={String(h.duracion)} onCambiar={(v) => v && h.setDuracion(Number(v))} />
        </View>

        <View style={styles.tarjeta}>
          <FilaInterruptor texto={T.urgencias} valor={h.urgencias247} onCambiar={h.setUrgencias247} />
          <Text style={styles.ayuda}>{T.urgenciasAyuda}</Text>
          {h.urgencias247 && (
            h.tieneTelefono
              ? <FilaInterruptor texto={T.mostrarTelefono} valor={h.mostrarTelefono} onCambiar={h.setMostrarTelefono} />
              : <Text style={styles.ayuda}>{T.sinTelefono}</Text>
          )}
        </View>

        {h.horario.independiente && (
          <View style={styles.tarjeta}>
            <Text style={styles.tarjetaTitulo}>{T.zona}</Text>
            <FilaInterruptor texto={T.aDomicilio} valor={h.aDomicilio} onCambiar={h.setADomicilio} />
            <CampoComunas comunas={h.comunas} onCambiar={h.setComunas} />
          </View>
        )}

        {h.faltaColegiado && (
          <View style={styles.tarjeta}>
            <CampoTexto etiqueta={T.colegiado} icono="escudo" value={h.colegiado} onChangeText={h.setColegiado} maxLength={30}
              ayuda={T.colegiadoAyuda} error={h.errorColegiado || undefined} />
            <BotonPequeno texto={T.colegiadoGuardar} variante="primario" onPress={h.guardarColegiado}
              cargando={h.guardandoColegiado} deshabilitado={!h.colegiado.trim()} />
          </View>
        )}
      </View>
    );
  };

  return (
    <PantallaFormulario
      titulo={T.titulo}
      pie={
        <View style={styles.pie}>
          <MensajeFormulario tipo="error" texto={h.error} />
          <MensajeFormulario tipo="aviso" texto={h.guardado ? T.guardado : ''} />
          <BotonPrincipal texto={T.guardar} textoCargando={T.guardando} cargando={h.guardando} deshabilitado={!h.horario} onPress={h.guardar} />
        </View>
      }>
      {contenido()}
    </PantallaFormulario>
  );
}
