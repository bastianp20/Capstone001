import { router } from 'expo-router';

import { ListaCitas } from '@/components/citas/ListaCitas';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { BarraFiltros } from '@/components/ui/BarraFiltros';
import { BotonIcono } from '@/components/ui/BotonIcono';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TEXTOS_CARGA, TEXTOS_CITAS, TEXTOS_INICIO } from '@/constants/constants';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useCitas } from '@/hooks/useCitas';

const pedirHora = () => router.push('/pedir-hora');

export default function CitasScreen() {
  useBarraEstadoClara();
  const c = useCitas();

  const contenido = () => {
    if (c.cargando) return <EstadoCarga />;
    if (c.error) return <EstadoVacio icono="cancelar" titulo={c.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={c.recargar} />;
    if (!c.hayCitasEnFiltro) {
      return (
        <EstadoVacio
          icono="citas"
          titulo={TEXTOS_CITAS.vacioTitulo[c.filtro]}
          detalle={TEXTOS_CITAS.vacioDetalle}
          textoAccion={c.filtro === 'proximas' ? TEXTOS_INICIO.pedirHora : undefined}
          onAccion={pedirHora}
        />
      );
    }
    if (!c.hayResultados) return <EstadoVacio icono="buscar" titulo={TEXTOS_CITAS.sinResultados} />;
    return <ListaCitas grupos={c.grupos} fotoDe={c.fotoDe} cancelandoId={c.cancelandoId} onCancelar={c.cancelar} />;
  };

  return (
    <PantallaLista
      recargando={c.recargando}
      onRecargar={c.recargar}
      encabezado={
        <EncabezadoPagina
          titulo={TEXTOS_CITAS.titulo}
          accion={<BotonIcono icono="mas" etiqueta={TEXTOS_INICIO.pedirHora} onPress={pedirHora} />}
        />
      }>
      <BarraFiltros
        busqueda={c.busqueda}
        onBuscar={c.setBusqueda}
        placeholder={TEXTOS_CITAS.buscar}
        opciones={c.opciones}
        filtro={c.filtro}
        onFiltrar={c.setFiltro}
      />
      <MensajeFormulario tipo="error" texto={c.errorAccion} />
      {contenido()}
    </PantallaLista>
  );
}
