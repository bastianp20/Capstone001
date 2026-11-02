import { router } from 'expo-router';

import { TarjetaPublicacionPropia } from '@/components/adopcion/publicaciones/TarjetaPublicacionPropia';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { BotonIcono } from '@/components/ui/BotonIcono';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { TEXTOS_ADOPTA, TEXTOS_CARGA, TEXTOS_MIS_PUBLICACIONES as T } from '@/constants/constants';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useMisPublicaciones } from '@/hooks/useMisPublicaciones';

const publicar = () => router.push('/adopcion/publicar');

/** Mis publicaciones en adopción: por estado, con sus postulaciones y avisos del equipo. */
export default function MisPublicacionesScreen() {
  useBarraEstadoClara();
  const m = useMisPublicaciones();

  const contenido = () => {
    if (m.cargando) return <EstadoCarga texto={T.cargando} />;
    if (m.errorCarga) return <EstadoVacio icono="cancelar" titulo={m.errorCarga} textoAccion={TEXTOS_CARGA.reintentar} onAccion={m.recargar} />;
    if (!m.hayPublicaciones) return <EstadoVacio icono="casa" titulo={T.vacioTitulo} detalle={T.vacioDetalle} textoAccion={TEXTOS_ADOPTA.publicar} onAccion={publicar} />;
    if (!m.visibles.length) return <EstadoVacio icono="huella" titulo={T.vacioFiltro} />;
    return m.visibles.map((p) => (
      <TarjetaPublicacionPropia
        key={p.id}
        publicacion={p}
        ocupado={m.ocupadoId === p.id}
        onPress={() => router.push(`/adopcion/publicacion/${p.id}`)}
        onRetirar={() => m.retirar(p)}
        onRepublicar={() => m.republicar(p)}
      />
    ));
  };

  return (
    <PantallaLista
      recargando={m.recargando}
      onRecargar={m.recargar}
      encabezado={
        <EncabezadoPagina titulo={T.titulo} subtitulo={T.subtitulo} onVolver={router.back} accion={<BotonIcono icono="mas" etiqueta={TEXTOS_ADOPTA.publicar} onPress={publicar} />} />
      }>
      {m.hayPublicaciones && <SelectorPildoras opciones={m.opciones} seleccionado={m.filtro} onSeleccionar={m.setFiltro} />}
      <MensajeFormulario tipo="error" texto={m.error} />
      {contenido()}
    </PantallaLista>
  );
}
