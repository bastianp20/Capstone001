import { View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TarjetaMensaje } from '@/components/superadmin/TarjetaMensaje';
import { BarraFiltros } from '@/components/ui/BarraFiltros';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TEXTOS_CARGA, TEXTOS_MENSAJES as T } from '@/constants/constants';
import { listaGruposStyles as styles } from '@/css/Compartido';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useMensajes } from '@/hooks/useMensajes';

export default function MensajesScreen() {
  useBarraEstadoClara();
  const m = useMensajes();
  const s = m.superadmin;

  const contenido = () => {
    if (s.cargando) return <EstadoCarga />;
    if (s.error) return <EstadoVacio icono="cancelar" titulo={s.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={s.recargar} />;
    if (!m.hayEnFiltro) return <EstadoVacio icono="mensaje" titulo={T.vacio} />;
    if (!m.visibles.length) return <EstadoVacio icono="buscar" titulo={T.sinResultados} />;
    return (
      <View style={styles.grupo}>
        {m.visibles.map((msg) => (
          <TarjetaMensaje key={msg.id} mensaje={msg} ocupado={m.ocupadoId === msg.id} onResponder={m.responder} onCambiarEstado={m.cambiarEstado} />
        ))}
      </View>
    );
  };

  return (
    <PantallaLista recargando={s.recargando} onRecargar={s.recargar} encabezado={<EncabezadoPagina titulo={T.titulo} />}>
      <BarraFiltros busqueda={m.busqueda} onBuscar={m.setBusqueda} placeholder={T.buscar} opciones={m.opciones} filtro={m.filtro} onFiltrar={m.setFiltro} />
      <MensajeFormulario tipo="error" texto={m.error} />
      {contenido()}
    </PantallaLista>
  );
}
