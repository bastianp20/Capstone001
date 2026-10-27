import { router } from 'expo-router';
import { View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { AccionesCitaVeterinario } from '@/components/veterinario/AccionesCitaVeterinario';
import { BarraFiltros } from '@/components/ui/BarraFiltros';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { ModalTexto } from '@/components/ui/ModalTexto';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TarjetaCitaGestion } from '@/components/ui/TarjetaCitaGestion';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { TEXTOS_AGENDA_VETERINARIO as T, TEXTOS_CARGA, TEXTOS_VETERINARIO } from '@/constants/constants';
import { listaGruposStyles as styles } from '@/css/Compartido';
import { useAgendaVeterinario } from '@/hooks/useAgendaVeterinario';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';

export default function AgendaVeterinarioScreen() {
  useBarraEstadoClara();
  const g = useAgendaVeterinario();
  const a = g.acciones;

  const contenido = () => {
    if (g.cargando) return <EstadoCarga />;
    if (g.error) return <EstadoVacio icono="cancelar" titulo={g.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={g.recargar} />;
    if (!g.hayEnFiltro) return <EstadoVacio icono="citas" titulo={T.vacio} detalle={T.vacioDetalle} />;
    if (!g.grupos.length) return <EstadoVacio icono="buscar" titulo={T.sinResultados} />;
    return (
      <View style={styles.contenedor}>
        {g.grupos.map((grupo) => (
          <View key={grupo.titulo} style={styles.grupo}>
            <TituloSeccion texto={grupo.titulo} />
            {grupo.items.map((c) => (
              <TarjetaCitaGestion
                key={c.id}
                mascota={c.mascota}
                fotoMascota={c.fotoUrl}
                descripcionMascota={c.raza}
                dueno={c.dueno}
                fechaHora={c.fechaHora}
                soloHora
                motivo={c.motivo}
                estado={c.estado}
                sintomas={c.sintomas}
                alerta={c.alergias ? TEXTOS_VETERINARIO.alergia(c.alergias) : null}
                tono={c.estado === 'pendiente' ? 'crema' : null}
                onPress={() => router.push({ pathname: '/veterinario/paciente/[id]', params: { id: c.mascotaId } })}
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
          </View>
        ))}
      </View>
    );
  };

  return (
    <PantallaLista recargando={g.recargando} onRecargar={g.recargar} encabezado={<EncabezadoPagina titulo={T.titulo} />}>
      <BarraFiltros
        busqueda={g.busqueda}
        onBuscar={g.setBusqueda}
        placeholder={T.buscar}
        opciones={g.opciones}
        filtro={g.filtro}
        onFiltrar={g.setFiltro}
      />
      <MensajeFormulario tipo="error" texto={a.error} />
      {contenido()}
      <ModalTexto
        visible={!!a.rechazando}
        titulo={TEXTOS_VETERINARIO.rechazarTitulo}
        detalle={a.rechazando ? TEXTOS_VETERINARIO.rechazarDetalle(a.rechazando.mascota) : undefined}
        placeholder={TEXTOS_VETERINARIO.rechazarPlaceholder}
        textoConfirmar={TEXTOS_VETERINARIO.rechazar}
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
