import { View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TarjetaDerivacion } from '@/components/veterinario/TarjetaDerivacion';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { ModalTexto } from '@/components/ui/ModalTexto';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { TEXTOS_CARGA, TEXTOS_DERIVACIONES as T } from '@/constants/constants';
import { listaGruposStyles as styles } from '@/css/Compartido';
import { useDerivacionesVeterinario } from '@/hooks/useDerivacionesVeterinario';

export default function DerivacionesScreen() {
  const d = useDerivacionesVeterinario();

  return (
    <PantallaFormulario titulo={T.titulo}>
      <SelectorPildoras opciones={d.opciones} seleccionado={d.filtro} onSeleccionar={d.setFiltro} />
      <MensajeFormulario tipo="error" texto={d.errorAccion} />
      {d.cargando ? (
        <EstadoCarga />
      ) : d.error ? (
        <EstadoVacio icono="cancelar" titulo={d.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={d.recargar} />
      ) : d.visibles.length === 0 ? (
        <EstadoVacio icono="derivacion" titulo={T.vacio} />
      ) : (
        <View style={styles.grupo}>
          {d.visibles.map((x) => (
            <TarjetaDerivacion key={x.id} derivacion={x} ocupado={d.ocupadoId === x.id} onRealizada={d.pedirRealizada} onRechazar={d.rechazar} />
          ))}
        </View>
      )}
      <ModalTexto
        visible={!!d.cerrando}
        titulo={T.resultadoTitulo}
        detalle={T.resultadoDetalle}
        placeholder={T.resultadoPlaceholder}
        textoConfirmar={T.realizada}
        obligatorio
        cargando={d.cerrando !== null && d.ocupadoId === d.cerrando.id}
        error={d.errorModal}
        onConfirmar={d.confirmarRealizada}
        onCerrar={d.cerrarModal}
      />
    </PantallaFormulario>
  );
}
