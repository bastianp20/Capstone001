import { Pressable, Text, View } from 'react-native';

import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { Icono } from '@/components/ui/Icono';
import { COLORES, TEXTOS_SOLIDARIA as T, TONOS_TARJETA } from '@/constants/constants';
import { tarjetaAnimalSolidarioStyles as styles } from '@/css/SolidariaPage';
import type { TarjetaAnimalSolidarioProps } from '@/interfaces';
import { esperaAtencion } from '@/lib/solidaria';

import { FotoAnimal } from './FotoAnimal';

/** Un animal en adopción para el veterinario: quién lo cuida, si pidió revisión, si ya lo atendió y "Atender". */
export function TarjetaAnimalSolidario({ animal: a, onAtender, onVer }: TarjetaAnimalSolidarioProps) {
  return (
    <Pressable onPress={onVer} accessibilityRole="button" style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}>
      <FotoAnimal fotoUrl={a.fotoUrl} especie={a.especie} estilo={styles.foto} />
      <View style={styles.cuerpo}>
        <Text style={styles.nombre} numberOfLines={1}>
          {a.nombre}
        </Text>
        <Text style={styles.detalle} numberOfLines={1}>
          {[a.raza, a.edad, a.comuna].join(' · ')}
        </Text>
        <View style={styles.quien}>
          <Icono nombre="casa" tamano={13} color={COLORES.textoSecundario} />
          <Text style={styles.quienTexto} numberOfLines={1}>
            {a.refugio ?? a.publicador}
          </Text>
        </View>
        <View style={styles.chips}>
          {esperaAtencion(a) && <Etiqueta texto={T.revisionSolicitada} colorFondo={TONOS_TARJETA.crema.fondo} colorTexto={TONOS_TARJETA.crema.icono} />}
          {a.enProceso && <Etiqueta texto={T.enProceso} colorFondo={COLORES.estados.en_curso.fondo} colorTexto={COLORES.estados.en_curso.texto} />}
        </View>
      </View>
      <View style={styles.lado}>
        {a.yaAtendi && (
          <View style={styles.atendido}>
            <Icono nombre="check" tamano={14} color={COLORES.primario} grosor={2.6} />
            <Text style={styles.atendidoTexto}>{T.atendido}</Text>
          </View>
        )}
        <BotonPequeno texto={T.atender} variante="coral" onPress={onAtender} />
      </View>
    </Pressable>
  );
}
