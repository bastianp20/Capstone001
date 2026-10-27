import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ListaAhoraCentro } from '@/components/centro/ListaAhoraCentro';
import { TarjetaCitasSemana } from '@/components/centro/TarjetaCitasSemana';
import { TarjetaHorarioHoy } from '@/components/centro/TarjetaHorarioHoy';
import { TarjetaSuscripcion } from '@/components/centro/TarjetaSuscripcion';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { AvatarIniciales } from '@/components/ui/AvatarIniciales';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { IndicadorPastel } from '@/components/ui/IndicadorPastel';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { TEXTOS_CARGA, TEXTOS_CENTRO as T } from '@/constants/constants';
import { resumenCentroStyles as styles } from '@/css/CentroPage';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useResumenCentro } from '@/hooks/useResumenCentro';

const irAPlanes = () => router.push('/centro/planes');

export default function ResumenCentroScreen() {
  useBarraEstadoClara();
  const r = useResumenCentro();
  const c = r.centro;

  const contenido = () => {
    if (c.cargando) return <EstadoCarga />;
    if (c.error) return <EstadoVacio icono="cancelar" titulo={c.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={c.recargar} />;
    if (!r.detalle) return <EstadoVacio icono="centro" titulo={T.sinCentros} />;
    return (
      <>
        <View style={styles.bento}>
          <TarjetaCitasSemana citasHoy={r.citasHoy} porDia={r.semana.porDia} indiceHoy={r.semana.indiceHoy} />
          <View style={styles.columna}>
            <IndicadorPastel tono="durazno" etiqueta={T.porConfirmar} valor={r.porConfirmar} onPress={() => router.navigate('/centro/agenda')} />
            <IndicadorPastel tono="lavanda" etiqueta={T.equipo} valor={r.veterinarios} detalle={T.veterinarios(r.veterinarios)} onPress={() => router.navigate('/centro/equipo')} />
          </View>
        </View>

        <TarjetaSuscripcion suscripcion={r.suscripcion} onVerPlanes={irAPlanes} />

        <View style={styles.seccion}>
          <TituloSeccion texto={T.ahora} />
          {r.ahora.length ? <ListaAhoraCentro citas={r.ahora} /> : <MensajeFormulario tipo="aviso" texto={T.sinCitasProximas} />}
        </View>

        <TarjetaHorarioHoy texto={r.horarioHoy} />
      </>
    );
  };

  return (
    <PantallaLista
      recargando={c.recargando}
      onRecargar={c.recargar}
      encabezado={
        <EncabezadoPagina
          titulo={T.resumen}
          subtitulo={r.detalle?.nombre}
          accion={
            <Pressable onPress={() => router.navigate('/centro/mi-centro')} accessibilityRole="button" accessibilityLabel="Mi centro">
              <AvatarIniciales nombre={r.nombreCompleto} tamano={44} />
            </Pressable>
          }>
          {c.centros.length > 1 && (
            <SelectorPildoras
              opciones={c.centros.map((x) => ({ valor: String(x.id), texto: x.nombre }))}
              seleccionado={String(c.centroId)}
              onSeleccionar={(id) => c.elegirCentro(Number(id))}
              variante="sobrePrimario"
            />
          )}
        </EncabezadoPagina>
      }>
      {contenido()}
    </PantallaLista>
  );
}
