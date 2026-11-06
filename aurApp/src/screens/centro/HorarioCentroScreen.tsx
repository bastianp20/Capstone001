import { Text, View } from 'react-native';

import { FilaDiaHorarioCentro } from '@/components/centro/FilaDiaHorarioCentro';
import { TablaHorarios } from '@/components/centro/TablaHorarios';
import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TEXTOS_CARGA, TEXTOS_HORARIO_CENTRO as T } from '@/constants/constants';
import { useCentro } from '@/context/CentroContext';
import { useHorarioCentroStyles } from '@/css/UrgenciasCentroPage';
import { useHorarioCentro } from '@/hooks/useHorarioCentro';

/** Mi centro → "Horario del centro". Si atienden 24/7 se muestra completo y sin editar. */
export default function HorarioCentroScreen() {
  const styles = useHorarioCentroStyles();
  const h = useHorarioCentro();
  const c = useCentro();

  const contenido = () => {
    if (h.cargando) return <EstadoCarga />;
    if (h.errorCarga) return <EstadoVacio icono="cancelar" titulo={h.errorCarga ?? TEXTOS_CARGA.error} />;
    if (h.es247) {
      return (
        <View style={styles.cuerpo}>
          <View style={styles.completo}>
            <Text style={styles.completoTitulo}>{T.abierto247}</Text>
            <Text style={styles.bajada}>{T.ayuda247}</Text>
          </View>
          <TablaHorarios horarios={c.datos?.detalle.horarios ?? []} />
        </View>
      );
    }
    return (
      <View style={styles.cuerpo}>
        <Text style={styles.bajada}>{T.ayuda}</Text>
        {h.dias.map((d, i) => <FilaDiaHorarioCentro key={d.dia} dia={d} onCambiar={(cambio) => h.cambiarDia(i, cambio)} />)}
      </View>
    );
  };

  return (
    <PantallaFormulario
      titulo={T.titulo}
      pie={h.es247 || h.cargando ? undefined : (
        <View style={styles.pie}>
          <MensajeFormulario tipo="error" texto={h.error} />
          <MensajeFormulario tipo="aviso" texto={h.guardado ? T.guardado : ''} />
          <BotonPrincipal texto={T.guardar} textoCargando={T.guardando} cargando={h.guardando} onPress={h.guardar} />
        </View>
      )}>
      {contenido()}
    </PantallaFormulario>
  );
}
