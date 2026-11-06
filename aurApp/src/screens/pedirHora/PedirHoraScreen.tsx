import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { PasoDiaHoraCita } from '@/components/pedirHora/PasoDiaHoraCita';
import { PasoDondeCita } from '@/components/pedirHora/PasoDondeCita';
import { PasoMascotaCita } from '@/components/pedirHora/PasoMascotaCita';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { IndicadorPasos } from '@/components/ui/IndicadorPasos';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { ResultadoSolicitud } from '@/components/ui/ResultadoSolicitud';
import { PASOS_PEDIR_HORA, TEXTOS_INICIO, TEXTOS_PEDIR_HORA as T } from '@/constants/constants';
import { usePasosPedirHoraStyles } from '@/css/PedirHoraPage';
import { usePedirHora } from '@/hooks/usePedirHora';

/** Pedir hora en 3 pasos: Mascota · Dónde · Día y hora. */
export default function PedirHoraScreen() {
  const styles = usePasosPedirHoraStyles();
  const params = useLocalSearchParams<{ mascotaId?: string }>();
  const p = usePedirHora(params.mascotaId ? Number(params.mascotaId) : null);

  if (p.enviada) {
    return (
      <PantallaFormulario titulo={T.titulo}>
        <ResultadoSolicitud titulo={T.listoTitulo} detalle={T.listoDetalle(p.lugar)} textoBoton={T.verMisCitas} onPress={() => router.replace('/citas')} />
      </PantallaFormulario>
    );
  }

  if (p.mascotas.length === 0) {
    return (
      <PantallaFormulario titulo={T.titulo}>
        <EstadoVacio icono="huella" titulo={T.sinMascotas} textoAccion={TEXTOS_INICIO.agregarMascota} onAccion={() => router.replace('/mascota/nueva')} />
      </PantallaFormulario>
    );
  }

  const ultimo = p.paso === PASOS_PEDIR_HORA.length - 1;

  return (
    <PantallaFormulario
      titulo={T.titulo}
      onVolver={p.paso === 0 ? router.back : p.volver}
      pie={
        <View style={styles.pie}>
          <MensajeFormulario tipo="error" texto={p.error} />
          {ultimo ? (
            <BotonPrincipal texto={T.enviar} textoCargando={T.enviando} cargando={p.enviando} onPress={p.enviar} tono="coral" />
          ) : (
            <BotonPrincipal texto={T.continuar} onPress={p.continuar} tono="coral" conFlecha />
          )}
        </View>
      }>
      <IndicadorPasos pasos={PASOS_PEDIR_HORA} actual={p.paso} />

      {p.paso === 0 && (
        <PasoMascotaCita
          mascotas={p.mascotas}
          mascotaId={p.mascotaId}
          onMascota={p.setMascotaId}
          motivo={p.motivo}
          onMotivo={p.setMotivo}
          sintomas={p.sintomas}
          onSintoma={p.alternarSintoma}
        />
      )}

      {p.paso === 1 && (
        <PasoDondeCita
          mascota={p.mascota}
          onCambiarMascota={p.irAMascota}
          filtro={p.filtro}
          modo={p.modo}
          onModo={p.setModo}
          opciones={p.opciones}
          elegida={p.claveElegida}
          onElegir={p.elegirOpcion}
          resumen={p.resumen}
          cargando={p.cargandoDestinos}
          error={p.errorDestinos}
          onReintentar={p.recargarDestinos}
        />
      )}

      {p.paso === 2 && (
        <PasoDiaHoraCita
          lugar={p.lugar}
          opcionesVeterinario={p.opcionesVeterinario}
          veterinario={p.veterinarioSeleccionado}
          onVeterinario={p.elegirVeterinario}
          ayudaVeterinario={p.ayudaVeterinario}
          dias={p.dias}
          fecha={p.fecha}
          onFecha={p.elegirFecha}
          ayudaDia={p.ayudaDia}
          horas={p.horas}
          hora={p.hora}
          onHora={p.setHora}
        />
      )}
    </PantallaFormulario>
  );
}
