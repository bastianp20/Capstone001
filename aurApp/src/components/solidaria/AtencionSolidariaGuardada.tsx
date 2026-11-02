import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { BotonSecundario } from '@/components/formulario/BotonSecundario';
import { AvatarMascota } from '@/components/ui/AvatarMascota';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { Icono } from '@/components/ui/Icono';
import { COLORES, TEXTOS_ATENCION_SOLIDARIA as T, TEXTOS_SOLIDARIA } from '@/constants/constants';
import { atencionGuardadaStyles as styles } from '@/css/SolidariaPage';
import type { AtencionSolidariaGuardadaProps } from '@/interfaces';
import { formatFechaCorta, hoy } from '@/lib/fechas';
import { primerNombre } from '@/lib/texto';

import { IlustracionGracias } from './IlustracionGracias';

/** "¡Gracias!": el sello tal como se verá en Adopta y el impacto actualizado. */
export function AtencionSolidariaGuardada({ guardada: g, nombreVeterinario, onOtro, onMisAtenciones }: AtencionSolidariaGuardadaProps) {
  return (
    <View style={styles.contenedor}>
      <IlustracionGracias />
      <Text style={styles.titulo}>{T.gracias(primerNombre(nombreVeterinario))}</Text>
      <Text style={styles.texto}>{T.graciasTexto(g.nombreAnimal)}</Text>
      <View style={styles.sello}>
        <View style={styles.selloFila}>
          <AvatarMascota nombre={g.nombreAnimal} fotoUrl={g.fotoUrl} tamano={56} tono="durazno" />
          <Text style={styles.selloNombre}>{g.nombreAnimal}</Text>
        </View>
        <Etiqueta
          texto={T.sello(g.solidario, nombreVeterinario, formatFechaCorta(hoy()))}
          icono={g.solidario ? 'corazon' : 'escudo'}
          colorFondo={COLORES.primarioSuave}
          colorTexto={COLORES.primarioOscuro}
        />
      </View>
      {g.solidario && (
        <View style={styles.impacto}>
          <Text style={styles.impactoTexto}>{TEXTOS_SOLIDARIA.atendidosGratis(g.solidarias)}</Text>
          <View style={styles.impactoFlecha}>
            <Icono nombre="flechaArriba" tamano={16} color={COLORES.primario} grosor={2.4} />
          </View>
        </View>
      )}
      <View style={styles.botones}>
        <BotonPrincipal texto={T.otro} onPress={onOtro} tono="coral" />
        <BotonSecundario texto={T.misAtenciones} tono="verde" onPress={onMisAtenciones} />
      </View>
    </View>
  );
}
