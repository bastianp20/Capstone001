import { Text, View } from 'react-native';

import { CirculoIcono } from '@/components/ui/CirculoIcono';
import { LineaEstados } from '@/components/ui/LineaEstados';
import { TarjetaAviso } from '@/components/ui/TarjetaAviso';
import { COLORES, TEXTOS_ELIMINAR_CUENTA as T } from '@/constants/constants';
import { solicitudEnviadaStyles as styles } from '@/css/CuentaPage';
import type { SolicitudEliminacionEnviadaProps } from '@/interfaces';
import { cuandoFue } from '@/lib/fechas';

/** La solicitud ya está en revisión: qué sigue y que puede seguir usando la app. */
export function SolicitudEliminacionEnviada({ correo, creadaEn }: SolicitudEliminacionEnviadaProps) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.halo}>
        <CirculoIcono icono="relojArena" tamano={104} tamanoIcono={46} colorIcono={COLORES.primario} colorFondo={COLORES.primarioSuave} />
      </View>
      <Text style={styles.titulo}>{T.recibimos}</Text>
      <Text style={styles.texto}>{T.revisaremos(correo)}</Text>
      <View style={styles.linea}>
        <LineaEstados
          pasos={[
            { texto: T.pasoEnviada(cuandoFue(creadaEn)), estado: 'hecho' },
            { texto: T.pasoRevision, estado: 'actual' },
            { texto: T.pasoEliminada, estado: 'pendiente' },
          ]}
        />
      </View>
      <TarjetaAviso texto={T.mientrasTanto} />
    </View>
  );
}
