import { router, useLocalSearchParams } from 'expo-router';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { GrillaDias } from '@/components/pedirHora/GrillaDias';
import { GrillaHoras } from '@/components/pedirHora/GrillaHoras';
import { ResultadoSolicitud } from '@/components/ui/ResultadoSolicitud';
import { SelectorDestino } from '@/components/pedirHora/SelectorDestino';
import { ChipsMultiples } from '@/components/ui/ChipsMultiples';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { SINTOMAS_FRECUENTES, TEXTOS_CARGA, TEXTOS_INICIO, TEXTOS_PEDIR_HORA as T } from '@/constants/constants';
import { usePedirHora } from '@/hooks/usePedirHora';

export default function PedirHoraScreen() {
  const params = useLocalSearchParams<{ mascotaId?: string }>();
  const p = usePedirHora(params.mascotaId ? Number(params.mascotaId) : null);

  if (p.enviada) {
    return (
      <PantallaFormulario titulo={T.titulo}>
        <ResultadoSolicitud
          titulo={T.listoTitulo}
          detalle={T.listoDetalle(p.lugarElegido)}
          textoBoton={T.verMisCitas}
          onPress={() => router.replace('/citas')}
        />
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

  return (
    <PantallaFormulario
      titulo={T.titulo}
      pie={<BotonPrincipal texto={T.enviar} textoCargando={T.enviando} cargando={p.enviando} onPress={p.enviar} />}>
      <GrupoCampo titulo={T.mascota}>
        <SelectorPildoras
          opciones={p.mascotas.map((m) => ({ valor: String(m.id), texto: m.nombre }))}
          seleccionado={p.mascotaId === null ? '' : String(p.mascotaId)}
          onSeleccionar={(id) => p.setMascotaId(Number(id))}
        />
      </GrupoCampo>

      <GrupoCampo titulo={T.donde}>
        {p.cargandoCentros ? (
          <EstadoCarga texto={T.cargando} />
        ) : p.errorCentros ? (
          <EstadoVacio icono="cancelar" titulo={T.errorCarga} textoAccion={TEXTOS_CARGA.reintentar} onAccion={p.recargarCentros} />
        ) : (
          <SelectorDestino centros={p.centros} destino={p.destino} onElegir={p.elegirDestino} />
        )}
      </GrupoCampo>

      {p.destino !== null && (
        <GrupoCampo
          titulo={T.veterinario}
          ayuda={
            p.especialidad ??
            (!p.cargandoVeterinarios && p.veterinarios.length === 0
              ? p.esIndependiente
                ? T.sinIndependientes
                : T.sinVeterinarios
              : undefined)
          }>
          {p.cargandoVeterinarios ? (
            <EstadoCarga />
          ) : (
            p.opcionesVeterinario.length > 0 && (
              <SelectorPildoras opciones={p.opcionesVeterinario} seleccionado={p.veterinarioSeleccionado} onSeleccionar={p.elegirVeterinario} />
            )
          )}
        </GrupoCampo>
      )}

      {p.destino !== null && (
        <GrupoCampo titulo={T.dia} ayuda={p.textoHorario ?? undefined}>
          <GrillaDias dias={p.dias} seleccionado={p.fecha} onElegir={p.elegirFecha} />
        </GrupoCampo>
      )}

      {p.fecha && (
        <GrupoCampo titulo={T.hora} ayuda={p.horas.length === 0 ? T.sinHoras : undefined}>
          <GrillaHoras horas={p.horas} seleccionada={p.hora} onElegir={p.setHora} />
        </GrupoCampo>
      )}

      <CampoTexto
        etiqueta={T.motivo}
        icono="estetoscopio"
        value={p.motivo}
        onChangeText={p.setMotivo}
        placeholder={T.motivoPlaceholder}
        multiline
        maxLength={300}
      />

      <GrupoCampo titulo={T.sintomas}>
        <ChipsMultiples opciones={SINTOMAS_FRECUENTES} seleccionadas={p.sintomas} onAlternar={p.alternarSintoma} />
      </GrupoCampo>

      <MensajeFormulario tipo="error" texto={p.error} />
    </PantallaFormulario>
  );
}
