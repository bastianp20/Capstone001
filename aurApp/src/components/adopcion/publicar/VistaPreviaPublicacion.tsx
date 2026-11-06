import { Text, View } from 'react-native';

import { TarjetaListaIconos } from '@/components/ui/TarjetaListaIconos';
import { TEXTOS_FICHA_ADOPCION as F, TEXTOS_PUBLICAR as T } from '@/constants/constants';
import { useVistaPreviaStyles } from '@/css/PublicarAdopcionPage';
import type { ItemConIcono, VistaPreviaPublicacionProps } from '@/interfaces';
import { animalDeVistaPrevia } from '@/lib/adopcion';

import { TarjetaAnimalAdopcion } from '../TarjetaAnimalAdopcion';

const sinAccion = () => undefined;

/** Paso 4 · Revisar: la tarjeta tal como se verá en Adopta y un resumen de lo que se publicará. */
export function VistaPreviaPublicacion({ datos: d, nombreRefugio }: VistaPreviaPublicacionProps) {
  const styles = useVistaPreviaStyles();
  const animal = animalDeVistaPrevia(d, nombreRefugio);
  const resumen: ItemConIcono[] = [
    { icono: 'chispas', texto: d.personalidad.join(', ') },
    { icono: 'jeringa', texto: `${F.vacunas}: ${d.vacunasAlDia ? F.alDia : F.pendientes}` },
    { icono: 'tijeras', texto: `${F.esterilizado(animal.sexo)}: ${d.esterilizado ? F.si : F.no}` },
    { icono: 'escudo', texto: d.solicitaChequeo ? T.revision : T.sinRevision },
  ];
  if (nombreRefugio) resumen.push({ icono: 'casa', texto: `${T.aNombreDe}: ${nombreRefugio}` });
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{T.revisaTitulo}</Text>
      <View style={styles.tarjeta}>
        <TarjetaAnimalAdopcion animal={animal} guardado={false} onGuardar={sinAccion} onPress={sinAccion} />
      </View>
      <TarjetaListaIconos titulo={animal.nombre} items={resumen} />
    </View>
  );
}
