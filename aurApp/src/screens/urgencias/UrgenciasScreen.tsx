import { Text, View } from 'react-native';

import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { FiltrosUrgencias } from '@/components/urgencias/FiltrosUrgencias';
import { TarjetaCentroUrgencia } from '@/components/urgencias/TarjetaCentroUrgencia';
import { TarjetaVetUrgencia } from '@/components/urgencias/TarjetaVetUrgencia';
import { TEXTOS_CARGA, TEXTOS_URGENCIAS as T } from '@/constants/constants';
import { useUrgenciasStyles } from '@/css/UrgenciasPage';
import { useUrgencias } from '@/hooks/useUrgencias';

/** Urgencias (con o sin cuenta): quién atiende ahora, la UCI en vivo, y llamar o llegar con un toque. */
export default function UrgenciasScreen() {
  const styles = useUrgenciasStyles();
  const u = useUrgencias();

  const contenido = () => {
    if (u.cargando) return <EstadoCarga />;
    if (u.error) return <EstadoVacio icono="cancelar" titulo={T.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={u.recargar} />;
    return (
      <>
        <FiltrosUrgencias comunas={u.comunas} filtros={u.filtros} onCambiar={u.cambiarFiltros} />
        <View style={styles.seccion}>
          <TituloSeccion texto={T.centros} />
          {u.centros.length
            ? <View style={styles.lista}>{u.centros.map((c) => <TarjetaCentroUrgencia key={c.id} centro={c} ahora={u.ahora} />)}</View>
            : <EstadoVacio icono="buscar" titulo={T.sinResultados} />}
        </View>
        {u.veterinarios.length > 0 && (
          <View style={styles.seccion}>
            <TituloSeccion texto={T.veterinarios} />
            <View style={styles.lista}>{u.veterinarios.map((v) => <TarjetaVetUrgencia key={v.id} veterinario={v} />)}</View>
          </View>
        )}
      </>
    );
  };

  return (
    <PantallaFormulario titulo={T.titulo} subtitulo={T.subtitulo}>
      <View style={styles.cuerpo}>
        <Text style={styles.consejo}>{T.consejo}</Text>
        {contenido()}
      </View>
    </PantallaFormulario>
  );
}
