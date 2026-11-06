import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { BotonFiltros } from '@/components/adopcion/BotonFiltros';
import { CifrasAdopcion } from '@/components/adopcion/CifrasAdopcion';
import { FiltroRefugioActivo } from '@/components/adopcion/FiltroRefugioActivo';
import { GrillaAnimalesAdopcion } from '@/components/adopcion/GrillaAnimalesAdopcion';
import { HojaFiltrosAdopcion } from '@/components/adopcion/HojaFiltrosAdopcion';
import { TarjetaDarEnAdopcion } from '@/components/adopcion/TarjetaDarEnAdopcion';
import { TarjetaRefugio } from '@/components/adopcion/TarjetaRefugio';
import { TarjetaSumateRefugio } from '@/components/adopcion/TarjetaSumateRefugio';
import { BotonIcono } from '@/components/ui/BotonIcono';
import { CampoBusqueda } from '@/components/ui/CampoBusqueda';
import { ControlSegmentado } from '@/components/ui/ControlSegmentado';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { FilaChipsIcono } from '@/components/ui/FilaChipsIcono';
import { HojaContacto } from '@/components/ui/HojaContacto';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TarjetaAviso } from '@/components/ui/TarjetaAviso';
import {
  OPCIONES_ESPECIE_ADOPCION,
  OPCIONES_FILTRO_REFUGIOS,
  RUTA_WEB_SUMATE_REFUGIO,
  TEXTOS_ADOPTA as T,
  TEXTOS_CARGA,
  TEXTOS_REFUGIOS,
  VISTAS_ADOPTA,
} from '@/constants/constants';
import { useAdoptaStyles } from '@/css/AdoptaPage';
import { useAdopta } from '@/hooks/useAdopta';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useRefugios } from '@/hooks/useRefugios';
import type { AdoptaScreenProps } from '@/interfaces';
import { abrirPaginaWeb } from '@/lib/enlacesWeb';

const abrirFicha = (id: number) => router.push(`/adopcion/${id}`);
const publicar = () => router.push('/adopcion/publicar');
const misPublicaciones = () => router.push('/adopcion/mis-publicaciones');

/** Adopta: animales que buscan hogar (con filtros y guardados) y refugios verificados. */
export default function AdoptaScreen({ conVolver = false }: AdoptaScreenProps) {
  const styles = useAdoptaStyles();
  useBarraEstadoClara();
  const a = useAdopta();
  const r = useRefugios();
  const enAnimales = a.vista === 'animales';

  const animales = () => {
    if (a.cargando) return <EstadoCarga texto={T.cargando} />;
    if (a.error) return <EstadoVacio icono="cancelar" titulo={T.errorCarga} textoAccion={TEXTOS_CARGA.reintentar} onAccion={a.recargar} />;
    if (!a.visibles.length) return <EstadoVacio icono={a.filtros.soloGuardados ? 'corazon' : 'huella'} titulo={a.mensajeVacio} />;
    return (
      <>
        <Text style={styles.resultados}>{T.resultados(a.visibles.length)}</Text>
        <GrillaAnimalesAdopcion animales={a.visibles} estaGuardado={a.estaGuardado} onGuardar={a.alternarGuardado} onAbrir={abrirFicha} />
      </>
    );
  };

  const refugios = () => {
    if (r.cargando) return <EstadoCarga texto={TEXTOS_REFUGIOS.cargando} />;
    if (r.error) return <EstadoVacio icono="cancelar" titulo={TEXTOS_REFUGIOS.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={r.recargar} />;
    if (!r.visibles.length) return <EstadoVacio icono="casa" titulo={r.hayRefugios ? TEXTOS_REFUGIOS.sinResultados : TEXTOS_REFUGIOS.vacio} />;
    return r.visibles.map((x) => <TarjetaRefugio key={x.id} refugio={x} onVerAnimales={() => a.verAnimalesDe(x)} onContactar={() => r.contactar(x)} />);
  };

  return (
    <PantallaLista
      recargando={enAnimales ? a.recargando : r.recargando}
      onRecargar={enAnimales ? a.recargar : r.recargar}
      encabezado={
        <EncabezadoPagina
          titulo={T.titulo}
          subtitulo={T.subtitulo}
          onVolver={conVolver ? router.back : undefined}
          accion={<BotonIcono icono="mas" etiqueta={T.publicar} onPress={publicar} />}>
          <CifrasAdopcion cifras={enAnimales ? a.cifras : r.cifras} />
        </EncabezadoPagina>
      }>
      <ControlSegmentado opciones={VISTAS_ADOPTA} valor={a.vista} onCambiar={a.setVista} />

      {enAnimales ? (
        <>
          {a.refugioActivo && <FiltroRefugioActivo nombre={a.refugioActivo} onQuitar={a.quitarRefugio} />}
          <View style={styles.barra}>
            <View style={styles.filaBusqueda}>
              <View style={styles.busqueda}>
                <CampoBusqueda valor={a.busqueda} onCambiar={a.setBusqueda} placeholder={T.buscar} />
              </View>
              <BotonFiltros cantidad={a.filtrosEnHoja} onPress={a.abrirHoja} />
            </View>
            <FilaChipsIcono opciones={OPCIONES_ESPECIE_ADOPCION} valor={a.filtros.especie} onCambiar={a.setEspecie} />
          </View>
          {animales()}
          <TarjetaDarEnAdopcion onPublicar={publicar} onMisPublicaciones={misPublicaciones} />
          <TarjetaAviso icono="escudo" titulo={T.gratuitaTitulo} texto={T.gratuitaTexto} />
        </>
      ) : (
        <>
          <View style={styles.barra}>
            <CampoBusqueda valor={r.busqueda} onCambiar={r.setBusqueda} placeholder={TEXTOS_REFUGIOS.buscar} />
            <FilaChipsIcono opciones={OPCIONES_FILTRO_REFUGIOS} valor={r.filtro} onCambiar={r.setFiltro} />
          </View>
          {refugios()}
          <TarjetaSumateRefugio onPress={() => abrirPaginaWeb(RUTA_WEB_SUMATE_REFUGIO)} />
        </>
      )}

      <HojaFiltrosAdopcion
        visible={a.hojaAbierta}
        filtros={a.filtros}
        comunas={a.comunas}
        resultados={a.visibles.length}
        onCambiar={a.cambiarFiltro}
        onLimpiar={a.limpiarFiltros}
        onCerrar={a.cerrarHoja}
      />
      <HojaContacto visible={!!r.contacto} contacto={r.contacto} onCerrar={r.cerrarContacto} />
    </PantallaLista>
  );
}
