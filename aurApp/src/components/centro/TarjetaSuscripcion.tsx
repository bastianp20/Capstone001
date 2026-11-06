import { Text, View } from 'react-native';

import { EnlaceTexto } from '@/components/formulario/EnlaceTexto';
import { BarraProgreso } from '@/components/ui/BarraProgreso';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { ESTADO_SUSCRIPCION_LABEL, TEXTOS_CENTRO as T } from '@/constants/constants';
import { useTarjetaSuscripcionStyles } from '@/css/CentroPage';
import type { Paleta, TarjetaSuscripcionProps } from '@/interfaces';
import { vencimientoSuscripcion } from '@/lib/centro';
import { useColores } from '@/context/TemaContext';

const colorEstado = (c: Paleta) => ({
  prueba: c.estados.pendiente,
  activa: c.estados.confirmada,
  vencida: c.estados.cancelada,
  cancelada: c.estados.cancelada,
});

export function TarjetaSuscripcion({ suscripcion: s, onVerPlanes }: TarjetaSuscripcionProps) {
  const COLORES = useColores();
  const styles = useTarjetaSuscripcionStyles();
  if (!s) {
    return (
      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>{T.suscripcion}</Text>
        <Text style={styles.detalle}>{T.sinSuscripcion}</Text>
        {onVerPlanes && <EnlaceTexto texto={T.verPlanes} onPress={onVerPlanes} alineacion="derecha" />}
      </View>
    );
  }
  const { texto, progreso } = vencimientoSuscripcion(s);
  const limite = s.plan.limiteVeterinarios;
  const color = colorEstado(COLORES)[s.estado];

  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <Text style={styles.etiqueta}>{T.suscripcion}</Text>
        <Etiqueta texto={ESTADO_SUSCRIPCION_LABEL[s.estado]} colorFondo={color.fondo} colorTexto={color.texto} conPunto />
      </View>
      <Text style={styles.plan}>{s.plan.nombre}</Text>
      <BarraProgreso progreso={progreso} color={COLORES.texto} />
      <Text style={styles.detalle}>{texto}</Text>
      {limite !== null && <BarraProgreso progreso={s.veterinarios / limite} color={COLORES.textoSecundario} />}
      <View style={styles.pie}>
        <Text style={styles.detalle}>{T.usoVeterinarios(s.veterinarios, limite)}</Text>
        {onVerPlanes && <EnlaceTexto texto={T.verPlanes} onPress={onVerPlanes} />}
      </View>
    </View>
  );
}
