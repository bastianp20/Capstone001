import { Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { TEXTOS_MIS_PUBLICACIONES as T } from '@/constants/constants';
import { useAvisoModeracionStyles } from '@/css/MisPublicacionesPage';
import type { AvisoModeracionProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** Aviso del equipo AuraPet sobre una publicación (oculta o con una advertencia). */
export function AvisoModeracionPublicacion({ aviso }: AvisoModeracionProps) {
  const COLORES = useColores();
  const styles = useAvisoModeracionStyles();
  const oculta = aviso.tipo === 'oculta';
  const color = oculta ? COLORES.peligro : COLORES.avisoTexto;
  return (
    <View style={[styles.aviso, { backgroundColor: oculta ? COLORES.peligroSuave : COLORES.aviso }]}>
      <Icono nombre={oculta ? 'ojoTachado' : 'alerta'} tamano={18} color={color} />
      <View style={styles.cuerpo}>
        <Text style={[styles.titulo, { color }]}>{oculta ? T.oculta : T.advertencia}</Text>
        {!!aviso.mensaje && <Text style={styles.texto}>{aviso.mensaje}</Text>}
      </View>
    </View>
  );
}
