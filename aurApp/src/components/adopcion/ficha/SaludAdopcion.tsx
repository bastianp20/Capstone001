import { Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { TEXTOS_FICHA_ADOPCION as T } from '@/constants/constants';
import { useSaludAdopcionStyles } from '@/css/FichaAdopcionPage';
import type { ItemSaludAdopcion, SaludAdopcionProps } from '@/interfaces';
import { useTonosTarjeta } from '@/context/TemaContext';

/** Vacunas, esterilización, microchip, peso y alergias en mosaicos. */
export function SaludAdopcion({ ficha: f }: SaludAdopcionProps) {
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useSaludAdopcionStyles();
  const items: ItemSaludAdopcion[] = [
    { icono: 'jeringa', tono: 'menta', etiqueta: T.vacunas, valor: f.vacunasAlDia ? T.alDia : T.pendientes },
    { icono: 'tijeras', tono: 'lavanda', etiqueta: T.esterilizado(f.sexo), valor: f.esterilizado ? T.si : T.no },
    { icono: 'etiqueta', tono: 'crema', etiqueta: T.microchip, valor: f.conMicrochip ? T.si : T.no },
    { icono: 'balanza', tono: 'durazno', etiqueta: T.peso, valor: f.pesoKg ? `${f.pesoKg} kg` : T.sinDato },
    { icono: 'alerta', tono: 'durazno', etiqueta: T.alergias, valor: f.alergias?.trim() || T.sinAlergias, ancho: true },
  ];
  return (
    <View style={styles.grilla}>
      {items.map((i) => (
        <View key={i.etiqueta} style={[styles.item, i.ancho && styles.itemAncho]}>
          <View style={[styles.icono, { backgroundColor: TONOS_TARJETA[i.tono].iconoFondo }]}>
            <Icono nombre={i.icono} tamano={17} color={TONOS_TARJETA[i.tono].icono} />
          </View>
          <View style={styles.textos}>
            <Text style={styles.etiqueta}>{i.etiqueta}</Text>
            <Text style={styles.valor}>{i.valor}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
