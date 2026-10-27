import { View } from 'react-native';

import { TarjetaPlan } from '@/components/centro/TarjetaPlan';
import { TarjetaSuscripcion } from '@/components/centro/TarjetaSuscripcion';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { ModalTexto } from '@/components/ui/ModalTexto';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TEXTOS_PLANES as T } from '@/constants/constants';
import { listaGruposStyles as styles } from '@/css/Compartido';
import { usePlanesCentro } from '@/hooks/usePlanesCentro';

export default function PlanesScreen() {
  const p = usePlanesCentro();
  return (
    <PantallaFormulario titulo={T.titulo}>
      {p.cargando ? (
        <EstadoCarga />
      ) : (
        <View style={styles.grupo}>
          <TarjetaSuscripcion suscripcion={p.suscripcion} />
          <MensajeFormulario tipo="aviso" texto={p.aviso || (p.hayPendiente ? T.pendiente : '')} />
          {p.planes.map((plan) => (
            <TarjetaPlan
              key={plan.id}
              plan={plan}
              esActual={p.suscripcion?.plan.id === plan.id}
              esSolicitado={p.suscripcion?.planSolicitado === plan.id}
              puedeSolicitar={!p.hayPendiente}
              onSolicitar={p.elegir}
            />
          ))}
        </View>
      )}
      <ModalTexto
        visible={!!p.eligiendo}
        titulo={p.eligiendo ? T.modalTitulo(p.eligiendo.nombre) : ''}
        detalle={T.modalDetalle}
        placeholder={T.modalPlaceholder}
        textoConfirmar={T.enviar}
        cargando={p.enviando}
        error={p.error}
        onConfirmar={p.confirmar}
        onCerrar={p.cerrar}
      />
    </PantallaFormulario>
  );
}
