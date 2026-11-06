import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TarjetaEspecialidad } from '@/components/veterinario/TarjetaEspecialidad';
import { TEXTOS_ESPECIALIDADES_CENTRO as T, TONOS_ESPECIALIDADES } from '@/constants/constants';
import { useMisEspecialidadesStyles } from '@/css/MisEspecialidadesPage';
import { useEspecialidadesCentro } from '@/hooks/useEspecialidadesCentro';
import { iconoEspecialidad } from '@/lib/especialidades';

/** Mi centro → "Especialidades del centro" (las mismas tarjetas que usa el veterinario). */
export default function EspecialidadesCentroScreen() {
  const styles = useMisEspecialidadesStyles();
  const e = useEspecialidadesCentro();
  return (
    <PantallaFormulario
      titulo={T.titulo}
      pie={
        <View>
          <MensajeFormulario tipo="error" texto={e.error} />
          <MensajeFormulario tipo="aviso" texto={e.guardado ? T.guardado : ''} />
          <BotonPrincipal texto={T.guardar} textoCargando={T.guardando} cargando={e.guardando} onPress={e.guardar} />
        </View>
      }>
      {e.cargando ? (
        <EstadoCarga />
      ) : (
        <View style={styles.cuerpo}>
          <Text style={styles.bajada}>{T.bajada}</Text>
          <View style={styles.grilla}>
            {e.especialidades.map((x, i) => (
              <TarjetaEspecialidad
                key={x.id}
                nombre={x.nombre}
                icono={iconoEspecialidad(x.nombre)}
                tono={TONOS_ESPECIALIDADES[i % TONOS_ESPECIALIDADES.length]}
                marcada={e.seleccion.includes(x.id)}
                onPress={() => e.alternar(x.id)}
              />
            ))}
          </View>
        </View>
      )}
    </PantallaFormulario>
  );
}
