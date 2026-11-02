import { Pressable, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { CirculoIcono } from '@/components/ui/CirculoIcono';
import { COLORES, TEXTOS_RECETA_ATENCION as T } from '@/constants/constants';
import { recetaListaStyles as styles } from '@/css/RecetaPage';
import type { CanalReceta, RecetaListaProps } from '@/interfaces';

import { BotonCanal } from './BotonCanal';

const CANALES: CanalReceta[] = ['whatsapp', 'correo', 'guardar'];

/** "¡Receta lista!": quedó en la ficha y se puede enviar o guardar en PDF. */
export function RecetaLista({ mascota, dueno, ocupado, error, onCompartir, onVolver }: RecetaListaProps) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.halo}>
        <CirculoIcono icono="check" tamano={96} tamanoIcono={46} colorIcono={COLORES.primario} colorFondo={COLORES.primarioSuave} grosor={2.8} />
      </View>
      <Text style={styles.titulo}>{T.lista}</Text>
      <Text style={styles.texto}>{T.listaTexto(mascota, dueno)}</Text>
      <View style={styles.hoja}>
        <Svg width={150} height={190} viewBox="0 0 150 190" accessibilityElementsHidden>
          <Rect x="0" y="0" width="150" height="190" rx="10" fill={COLORES.blanco} />
          <Rect x="16" y="18" width="16" height="16" rx="4" fill={COLORES.primario} />
          <Rect x="38" y="22" width="52" height="8" rx="4" fill={COLORES.primario} />
          <Rect x="16" y="48" width="90" height="7" rx="3.5" fill={COLORES.texto} />
          {[68, 80, 92, 112, 124].map((y, i) => (
            <Rect key={y} x="16" y={y} width={i % 2 ? 96 : 118} height="6" rx="3" fill={COLORES.borde} />
          ))}
          <Path d="M88 168 c8 -14 14 -14 16 -4 s8 6 14 -6" stroke={COLORES.texto} strokeWidth="2" fill="none" strokeLinecap="round" />
          <Rect x="80" y="172" width="54" height="1.5" fill={COLORES.textoSecundario} />
        </Svg>
      </View>
      <View style={styles.canales}>
        {CANALES.map((c) => (
          <BotonCanal key={c} canal={c} onPress={() => onCompartir(c)} deshabilitado={ocupado} />
        ))}
      </View>
      <MensajeFormulario tipo="error" texto={error} />
      <Pressable onPress={onVolver} accessibilityRole="button" style={styles.volver}>
        <Text style={styles.volverTexto}>{T.volver}</Text>
      </Pressable>
    </View>
  );
}
