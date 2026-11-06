import { Text, View } from 'react-native';

import { ControlSegmentado } from '@/components/ui/ControlSegmentado';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { MODOS_DESTINO_CITA, TEXTOS_CARGA, TEXTOS_PEDIR_HORA as T } from '@/constants/constants';
import { usePasosPedirHoraStyles } from '@/css/PedirHoraPage';
import type { PasoDondeCitaProps } from '@/interfaces';

import { FiltroEspecialidades } from './FiltroEspecialidades';
import { MiniMascotaCita } from './MiniMascotaCita';
import { TarjetaDestinoCita } from './TarjetaDestinoCita';

/** Paso 2: la mascota elegida, el filtro de especialidades, Centros | Independientes y las tarjetas. */
export function PasoDondeCita(p: PasoDondeCitaProps) {
  const styles = usePasosPedirHoraStyles();
  return (
    <View style={styles.paso}>
      {p.mascota && <MiniMascotaCita mascota={p.mascota} onCambiar={p.onCambiarMascota} />}
      <FiltroEspecialidades {...p.filtro} />
      <ControlSegmentado opciones={MODOS_DESTINO_CITA} valor={p.modo} onCambiar={p.onModo} />
      {p.cargando ? (
        <EstadoCarga texto={T.cargando} />
      ) : p.error ? (
        <EstadoVacio icono="cancelar" titulo={T.errorCarga} textoAccion={TEXTOS_CARGA.reintentar} onAccion={p.onReintentar} />
      ) : p.opciones.length === 0 ? (
        <EstadoVacio icono="buscar" titulo={p.filtro.seleccion.length ? T.sinCoincidencias : p.modo === 'centros' ? T.sinCentros : T.sinIndependientes} />
      ) : (
        <>
          <Text style={styles.resumen}>{p.resumen}</Text>
          <View style={styles.lista} accessibilityRole="radiogroup">
            {p.opciones.map((o) => (
              <TarjetaDestinoCita key={o.clave} opcion={o} seleccionada={o.clave === p.elegida} onPress={() => p.onElegir(o)} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}
