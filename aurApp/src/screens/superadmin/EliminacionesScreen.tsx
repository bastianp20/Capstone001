import { View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TarjetaEliminacion } from '@/components/superadmin/TarjetaEliminacion';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { ModalTexto } from '@/components/ui/ModalTexto';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TEXTOS_CARGA, TEXTOS_ELIMINACIONES as T } from '@/constants/constants';
import { listaGruposStyles as styles } from '@/css/Compartido';
import { useEliminaciones } from '@/hooks/useEliminaciones';

export default function EliminacionesScreen() {
  const e = useEliminaciones();
  const s = e.superadmin;

  return (
    <PantallaFormulario titulo={T.titulo}>
      <MensajeFormulario tipo="error" texto={e.error} />
      {s.cargando ? (
        <EstadoCarga />
      ) : s.error ? (
        <EstadoVacio icono="cancelar" titulo={s.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={s.recargar} />
      ) : !e.solicitudes.length ? (
        <EstadoVacio icono="usuarioX" titulo={T.vacio} />
      ) : (
        <View style={styles.grupo}>
          {e.solicitudes.map((sol) => (
            <TarjetaEliminacion key={sol.id} solicitud={sol} ocupado={e.ocupadoId === sol.id} onAprobar={e.aprobar} onRechazar={e.pedirRechazo} />
          ))}
        </View>
      )}
      <ModalTexto
        visible={!!e.rechazando}
        titulo={T.rechazarTitulo}
        detalle={T.rechazarDetalle}
        placeholder={T.rechazarPlaceholder}
        textoConfirmar={T.rechazar}
        obligatorio
        cargando={e.rechazandoOcupado}
        error={e.errorRechazo}
        onConfirmar={e.confirmarRechazo}
        onCerrar={e.cerrarRechazo}
      />
    </PantallaFormulario>
  );
}
