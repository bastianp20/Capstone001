import { router } from 'expo-router';

import { TarjetaCasoModeracion } from '@/components/superadmin/TarjetaCasoModeracion';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { ModalTexto } from '@/components/ui/ModalTexto';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { OPCIONES_ESTADO_MODERACION, TEXTOS_CARGA, TEXTOS_MODERACION as T } from '@/constants/constants';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { useModeracion } from '@/hooks/useModeracion';

/** Moderación: publicaciones reportadas (por revisar, resueltas, descartadas) y la decisión del equipo. */
export default function ModeracionScreen() {
  useBarraEstadoClara();
  const m = useModeracion();
  const textosModal = m.pendiente ? T.modal[m.pendiente.decision] : null;

  const contenido = () => {
    if (m.cargando) return <EstadoCarga texto={T.cargando} />;
    if (m.errorCarga) return <EstadoVacio icono="cancelar" titulo={T.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={m.recargar} />;
    if (!m.casos.length) return <EstadoVacio icono="bandera" titulo={T.vacio[m.estado]} />;
    return m.casos.map((c) => (
      <TarjetaCasoModeracion
        key={c.adopcionId}
        caso={c}
        ocupado={m.ocupadoId === c.adopcionId}
        onVer={() => router.push(`/adopcion/${c.adopcionId}`)}
        onDecidir={(decision) => m.decidir(c, decision)}
      />
    ));
  };

  return (
    <PantallaLista recargando={m.recargando} onRecargar={m.recargar} encabezado={<EncabezadoPagina titulo={T.titulo} subtitulo={T.subtitulo} onVolver={router.back} />}>
      <SelectorPildoras opciones={[...OPCIONES_ESTADO_MODERACION]} seleccionado={m.estado} onSeleccionar={m.setEstado} />
      <MensajeFormulario tipo="error" texto={m.error} />
      {contenido()}
      <ModalTexto
        visible={!!m.pendiente}
        titulo={textosModal?.titulo ?? ''}
        detalle={textosModal?.detalle}
        placeholder={textosModal?.placeholder ?? ''}
        textoConfirmar={textosModal?.confirmar ?? ''}
        obligatorio={m.pendiente?.decision === 'advertir'}
        peligro={m.pendiente?.decision === 'ocultar'}
        cargando={m.modalOcupado}
        error={m.errorModal}
        onConfirmar={m.confirmarConMensaje}
        onCerrar={m.cerrarModal}
      />
    </PantallaLista>
  );
}
