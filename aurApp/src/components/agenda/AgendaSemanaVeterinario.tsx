import { router } from 'expo-router';
import { View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { TarjetaAviso } from '@/components/ui/TarjetaAviso';
import { TEXTOS_CARGA, TEXTOS_MI_AGENDA as T } from '@/constants/constants';
import { useAgendaSemanaStyles } from '@/css/MiAgendaPage';
import { useAgendaSemanaVeterinario } from '@/hooks/useAgendaSemanaVeterinario';
import { formatMesAnio } from '@/lib/fechas';

import { FilaHoraAgenda } from './FilaHoraAgenda';
import { NavegacionSemana } from './NavegacionSemana';
import { SelectorDiaAgenda } from './SelectorDiaAgenda';

/** Agenda → "Semana": todas las horas del día elegido (libres, tomadas, bloqueadas). */
export function AgendaSemanaVeterinario() {
  const styles = useAgendaSemanaStyles();
  const a = useAgendaSemanaVeterinario();

  const horas = () => {
    if (a.cargando) return <EstadoCarga />;
    if (a.error) return <EstadoVacio icono="cancelar" titulo={a.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={a.recargar} />;
    if (!a.celdas.length) return <EstadoVacio icono="reloj" titulo={T.sinHoras} />;
    return (
      <View style={styles.lista}>
        {a.celdas.map((c) => <FilaHoraAgenda key={c.inicio + (c.cita?.id ?? '')} celda={c} onPress={a.elegirCelda} />)}
      </View>
    );
  };

  return (
    <View style={styles.contenedor}>
      {a.sinHorario && (
        <View style={styles.aviso}>
          <TarjetaAviso titulo={T.sinHorarioTitulo} texto={T.sinHorarioTexto} icono="reloj" />
          <BotonPequeno texto={T.configurar} icono="reloj" variante="primario" onPress={() => router.push('/veterinario/horario')} />
        </View>
      )}
      <NavegacionSemana titulo={formatMesAnio(a.fecha)} onAnterior={a.semanaAnterior} onSiguiente={a.semanaSiguiente} />
      <SelectorDiaAgenda dias={a.dias} elegido={a.fecha} onElegir={a.elegirFecha} />
      <MensajeFormulario tipo="error" texto={a.errorAccion} />
      {horas()}
    </View>
  );
}
