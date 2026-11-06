import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { CifrasAdopcion } from '@/components/adopcion/CifrasAdopcion';
import { TarjetaPublicacionPropia } from '@/components/adopcion/publicaciones/TarjetaPublicacionPropia';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TarjetaCuposRefugio } from '@/components/refugio/TarjetaCuposRefugio';
import { BotonIcono } from '@/components/ui/BotonIcono';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { PreguntaOpciones } from '@/components/ui/PreguntaOpciones';
import { TarjetaAccion } from '@/components/ui/TarjetaAccion';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { OPCIONES_RECEPCION_REFUGIO, TEXTOS_CARGA, TEXTOS_MI_REFUGIO as T } from '@/constants/constants';
import { useMiRefugioStyles } from '@/css/MiRefugioPage';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useMiRefugio } from '@/hooks/useMiRefugio';

/** Mi refugio: cupos con − / +, si reciben animales, números del mes, publicar con la cámara y sus animales. */
export default function MiRefugioScreen() {
  const styles = useMiRefugioStyles();
  useBarraEstadoClara();
  const { id } = useLocalSearchParams<{ id: string }>();
  const refugioId = Number(id);
  const r = useMiRefugio(refugioId);
  const d = r.detalle;
  const publicar = () => router.push({ pathname: '/adopcion/publicar', params: { refugio: refugioId } });

  const cifras = d
    ? [
        { valor: d.publicadosMes, texto: T.cifras.publicados },
        { valor: d.postulacionesMes, texto: T.cifras.postulaciones },
        { valor: d.adoptadosMes, texto: T.cifras.adoptados },
      ]
    : [];

  const contenido = () => {
    if (r.cargando && !d) return <EstadoCarga texto={T.cargando} />;
    if (r.errorCarga || !d) return <EstadoVacio icono="cancelar" titulo={T.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={r.recargar} />;
    return (
      <>
        <TarjetaCuposRefugio ocupados={r.cupos} totales={d.cuposTotales} actualizadoEn={d.cuposActualizadosEn} guardando={r.guardando} onCambiar={r.cambiarCupos} />
        <MensajeFormulario tipo="error" texto={r.errorGuardar} />
        <View style={styles.seccion}>
          <PreguntaOpciones titulo={T.recepcion} opciones={OPCIONES_RECEPCION_REFUGIO} valor={r.recibe} onCambiar={r.cambiarRecepcion} />
        </View>
        <TarjetaAccion icono="camara" tono="durazno" titulo={T.publicar} detalle={T.publicarDetalle} onPress={publicar} />
        <TituloSeccion texto={T.animales} />
        <MensajeFormulario tipo="error" texto={r.acciones.error} />
        {r.animales.length ? (
          <View style={styles.lista}>
            {r.animales.map((p) => (
              <TarjetaPublicacionPropia
                key={p.id}
                publicacion={p}
                ocupado={r.acciones.ocupadoId === p.id}
                onPress={() => router.push(`/adopcion/publicacion/${p.id}`)}
                onRetirar={() => r.acciones.retirar(p)}
                onRepublicar={() => r.acciones.republicar(p)}
              />
            ))}
          </View>
        ) : (
          <EstadoVacio icono="huella" titulo={T.sinAnimales} textoAccion={T.publicar} onAccion={publicar} />
        )}
      </>
    );
  };

  return (
    <PantallaLista
      recargando={r.recargando}
      onRecargar={r.recargar}
      encabezado={
        <EncabezadoPagina
          titulo={T.titulo}
          subtitulo={d ? T.subtitulo(d.nombre) : undefined}
          onVolver={router.back}
          accion={<BotonIcono icono="mas" etiqueta={T.publicar} onPress={publicar} />}>
          <CifrasAdopcion cifras={cifras} />
        </EncabezadoPagina>
      }>
      {contenido()}
    </PantallaLista>
  );
}
