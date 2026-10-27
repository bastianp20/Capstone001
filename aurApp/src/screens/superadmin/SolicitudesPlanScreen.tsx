import { View } from 'react-native';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { TarjetaSolicitudPlan } from '@/components/superadmin/TarjetaSolicitudPlan';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TEXTOS_CARGA, TEXTOS_SOLICITUDES_PLAN as T } from '@/constants/constants';
import { listaGruposStyles as styles } from '@/css/Compartido';
import { useSolicitudesPlan } from '@/hooks/useSolicitudesPlan';

export default function SolicitudesPlanScreen() {
  const p = useSolicitudesPlan();
  const s = p.superadmin;

  return (
    <PantallaFormulario titulo={T.titulo}>
      <MensajeFormulario tipo="error" texto={p.error} />
      {s.cargando ? (
        <EstadoCarga />
      ) : s.error ? (
        <EstadoVacio icono="cancelar" titulo={s.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={s.recargar} />
      ) : !p.solicitudes.length ? (
        <EstadoVacio icono="plan" titulo={T.vacio} />
      ) : (
        <View style={styles.grupo}>
          {p.solicitudes.map((sol) => (
            <TarjetaSolicitudPlan key={sol.solicitudId} solicitud={sol} ocupado={p.ocupadoId === sol.solicitudId} onActivar={p.activar} onRechazar={p.rechazar} />
          ))}
        </View>
      )}
    </PantallaFormulario>
  );
}
