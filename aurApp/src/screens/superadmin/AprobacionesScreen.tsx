import { View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TarjetaSolicitud } from '@/components/superadmin/TarjetaSolicitud';
import { BarraFiltros } from '@/components/ui/BarraFiltros';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { ModalTexto } from '@/components/ui/ModalTexto';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TEXTOS_APROBACIONES as T, TEXTOS_CARGA } from '@/constants/constants';
import { listaGruposStyles as styles } from '@/css/Compartido';
import { useAprobaciones } from '@/hooks/useAprobaciones';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';

export default function AprobacionesScreen() {
  useBarraEstadoClara();
  const a = useAprobaciones();
  const { superadmin: s, resolver: r } = a;

  const contenido = () => {
    if (s.cargando) return <EstadoCarga />;
    if (s.error) return <EstadoVacio icono="cancelar" titulo={s.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={s.recargar} />;
    if (!a.hay) return <EstadoVacio icono="aprobaciones" titulo={T.vacio} />;
    if (!a.visibles.length) return <EstadoVacio icono="buscar" titulo={T.sinResultados} />;
    return (
      <View style={styles.grupo}>
        {a.visibles.map((sol) => (
          <TarjetaSolicitud key={sol.clave} solicitud={sol} ocupado={r.ocupadaClave === sol.clave} onAprobar={r.aprobar} onRechazar={r.pedirRechazo} />
        ))}
      </View>
    );
  };

  return (
    <PantallaLista recargando={s.recargando} onRecargar={s.recargar} encabezado={<EncabezadoPagina titulo={T.titulo} />}>
      {a.hay && (
        <BarraFiltros busqueda={a.busqueda} onBuscar={a.setBusqueda} placeholder={T.buscar} opciones={a.opciones} filtro={a.filtro} onFiltrar={a.setFiltro} />
      )}
      <MensajeFormulario tipo="error" texto={r.error} />
      {contenido()}
      <ModalTexto
        visible={!!r.rechazando}
        titulo={T.rechazarTitulo}
        detalle={r.rechazando ? T.rechazarDetalle(r.rechazando.nombre) : undefined}
        placeholder={T.rechazarPlaceholder}
        textoConfirmar={T.rechazar}
        obligatorio
        peligro
        cargando={r.rechazandoOcupado}
        error={r.errorRechazo}
        onConfirmar={r.confirmarRechazo}
        onCerrar={r.cerrarRechazo}
      />
    </PantallaLista>
  );
}
