import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { EnlaceTexto } from '@/components/formulario/EnlaceTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { AccionesCitaVeterinario } from '@/components/veterinario/AccionesCitaVeterinario';
import { AgendaDelDia } from '@/components/veterinario/AgendaDelDia';
import { TarjetaSiguientePaciente } from '@/components/veterinario/TarjetaSiguientePaciente';
import { AvatarIniciales } from '@/components/ui/AvatarIniciales';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { IndicadorNumero } from '@/components/ui/IndicadorNumero';
import { ModalTexto } from '@/components/ui/ModalTexto';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TarjetaAccion } from '@/components/ui/TarjetaAccion';
import { TarjetaCitaGestion } from '@/components/ui/TarjetaCitaGestion';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { COLORES, TEXTOS_CARGA, TEXTOS_VETERINARIO as T } from '@/constants/constants';
import { hoyStyles as styles } from '@/css/VeterinarioPage';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useHoyVeterinario } from '@/hooks/useHoyVeterinario';

const MAX_POR_CONFIRMAR = 3;
const abrirFicha = (mascotaId: number) => router.push({ pathname: '/veterinario/paciente/[id]', params: { id: mascotaId } });

export default function HoyScreen() {
  useBarraEstadoClara();
  const h = useHoyVeterinario();
  const a = h.acciones;

  const lugar = h.info?.centros.length ? h.info.centros.join(', ') : T.independiente;

  const contenido = () => {
    if (h.cargando) return <EstadoCarga />;
    if (h.error) return <EstadoVacio icono="cancelar" titulo={h.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={h.recargar} />;
    if (!h.info?.id) return <EstadoVacio icono="estetoscopio" titulo={T.sinFicha} detalle={T.sinFichaDetalle} />;

    return (
      <>
        <View style={styles.indicadores}>
          <IndicadorNumero etiqueta={T.citasHoy} valor={h.deHoy.length} />
          <IndicadorNumero
            etiqueta={T.atendidas}
            valor={`${h.atendidas}/${h.deHoy.length}`}
            progreso={h.deHoy.length ? h.atendidas / h.deHoy.length : 0}
          />
          <IndicadorNumero
            etiqueta={T.pendientes}
            valor={h.pendientes.length}
            colorValor={h.pendientes.length ? COLORES.estados.pendiente.texto : undefined}
          />
        </View>

        {h.info.estado === 'pendiente' && <MensajeFormulario tipo="aviso" texto={T.cuentaEnRevision} />}
        {h.info.estado === 'rechazado' && <MensajeFormulario tipo="error" texto={T.cuentaRechazada} />}
        <MensajeFormulario tipo="error" texto={a.error} />

        {h.siguiente ? (
          <TarjetaSiguientePaciente
            cita={h.siguiente}
            ocupado={a.ocupadoId === h.siguiente.id}
            onVerFicha={() => h.siguiente && abrirFicha(h.siguiente.mascotaId)}
            onIniciar={() => h.siguiente && a.iniciar(h.siguiente)}
            onTerminar={() => h.siguiente && a.terminar(h.siguiente)}
          />
        ) : (
          <MensajeFormulario tipo="aviso" texto={T.sinSiguiente} />
        )}

        {h.pendientes.length > 0 && (
          <View style={styles.seccion}>
            <TituloSeccion texto={T.porConfirmar} />
            {h.pendientes.slice(0, MAX_POR_CONFIRMAR).map((c) => (
              <TarjetaCitaGestion
                key={c.id}
                mascota={c.mascota}
                fotoMascota={c.fotoUrl}
                descripcionMascota={c.raza}
                dueno={c.dueno}
                fechaHora={c.fechaHora}
                motivo={c.motivo}
                estado={c.estado}
                sintomas={c.sintomas}
                tono="crema"
                acciones={
                  <AccionesCitaVeterinario
                    cita={c}
                    ocupado={a.ocupadoId === c.id}
                    onConfirmar={a.confirmar}
                    onRechazar={a.pedirRechazo}
                    onIniciar={a.iniciar}
                    onTerminar={a.terminar}
                  />
                }
              />
            ))}
            {h.pendientes.length > MAX_POR_CONFIRMAR && (
              <EnlaceTexto texto={T.verTodas(h.pendientes.length)} onPress={() => router.navigate('/veterinario/agenda')} alineacion="centro" />
            )}
          </View>
        )}

        <View style={styles.seccion}>
          <TituloSeccion texto={T.agendaDeHoy} />
          {h.deHoy.length ? (
            <AgendaDelDia citas={h.deHoy} onAbrir={(c) => abrirFicha(c.mascotaId)} />
          ) : (
            <MensajeFormulario tipo="aviso" texto={T.sinCitasHoy} />
          )}
        </View>

        <TarjetaAccion
          icono="derivacion"
          tono="lavanda"
          titulo={T.derivaciones}
          detalle={T.derivacionesDetalle}
          cantidad={h.derivacionesPendientes}
          onPress={() => router.push('/veterinario/derivaciones')}
        />
      </>
    );
  };

  return (
    <PantallaLista
      recargando={h.recargando}
      onRecargar={h.recargar}
      encabezado={
        <EncabezadoPagina
          titulo={h.saludo}
          subtitulo={`${h.fecha} · ${lugar}`}
          accion={
            <Pressable onPress={() => router.navigate('/veterinario/perfil')} accessibilityRole="button" accessibilityLabel="Perfil">
              <AvatarIniciales nombre={h.nombreCompleto} tamano={44} />
            </Pressable>
          }
        />
      }>
      {contenido()}
      <ModalTexto
        visible={!!a.rechazando}
        titulo={T.rechazarTitulo}
        detalle={a.rechazando ? T.rechazarDetalle(a.rechazando.mascota) : undefined}
        placeholder={T.rechazarPlaceholder}
        textoConfirmar={T.rechazar}
        obligatorio
        peligro
        cargando={a.rechazandoOcupado}
        error={a.errorRechazo}
        onConfirmar={a.confirmarRechazo}
        onCerrar={a.cerrarRechazo}
      />
    </PantallaLista>
  );
}
