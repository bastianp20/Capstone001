import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { LineaDeTiempo } from '@/components/historial/LineaDeTiempo';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { TEXTOS_CARGA, TEXTOS_HISTORIAL } from '@/constants/constants';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useHistorial } from '@/hooks/useHistorial';

export default function HistorialScreen() {
  useBarraEstadoClara();
  const h = useHistorial();

  const contenido = () => {
    if (h.cargando) return <EstadoCarga />;
    if (h.error) return <EstadoVacio icono="cancelar" titulo={h.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={h.recargar} />;
    if (!h.hayRegistros) return <EstadoVacio icono="historial" titulo={TEXTOS_HISTORIAL.vacioTitulo} detalle={TEXTOS_HISTORIAL.vacioDetalle} />;
    return (
      <>
        <SelectorPildoras opciones={h.opcionesTipo} seleccionado={h.filtro} onSeleccionar={h.setFiltro} />
        <LineaDeTiempo grupos={h.grupos} mostrarMascota={h.mostrarMascota} />
      </>
    );
  };

  return (
    <PantallaLista
      recargando={h.recargando}
      onRecargar={h.recargar}
      encabezado={
        <EncabezadoPagina
          titulo={TEXTOS_HISTORIAL.titulo}
          accion={
            h.hayMascotas && (
              <BotonPequeno
                texto={h.generandoPdf ? TEXTOS_HISTORIAL.generandoPdf : TEXTOS_HISTORIAL.fichaPdf}
                icono="descarga"
                cargando={h.generandoPdf}
                onPress={h.descargarFicha}
              />
            )
          }>
          {h.opcionesMascota.length > 2 && (
            <SelectorPildoras opciones={h.opcionesMascota} seleccionado={h.mascotaElegida} onSeleccionar={h.elegirMascota} variante="sobrePrimario" />
          )}
        </EncabezadoPagina>
      }>
      <MensajeFormulario tipo="aviso" texto={h.avisoPdf} />
      <MensajeFormulario tipo="error" texto={h.errorPdf} />
      {contenido()}
    </PantallaLista>
  );
}
