import { Text, View } from 'react-native';

import { Icono } from '@/components/ui/Icono';
import { SEXO_ADOPCION_TEXTO, TEXTOS_ADOPTA, TONOS_ESPECIALIDADES } from '@/constants/constants';
import { useCabeceraFichaStyles } from '@/css/FichaAdopcionPage';
import type { CabeceraFichaAdopcionProps } from '@/interfaces';

import { SelloRevisado } from '../SelloRevisado';
import { useColores, useTonosTarjeta } from '@/context/TemaContext';

/** Nombre, raza · edad · sexo, comuna, sello, personalidad y su frase. */
export function CabeceraFichaAdopcion({ ficha: f }: CabeceraFichaAdopcionProps) {
  const COLORES = useColores();
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useCabeceraFichaStyles();
  return (
    <View style={styles.contenedor}>
      <View style={styles.filaNombre}>
        <Text style={styles.nombre}>{f.nombre}</Text>
        {f.enProceso && <Text style={styles.enProceso}>{TEXTOS_ADOPTA.enProceso}</Text>}
      </View>
      <Text style={styles.detalle}>{[f.raza, f.edad, SEXO_ADOPCION_TEXTO[f.sexo]].join(' · ')}</Text>
      <View style={styles.lugar}>
        <Icono nombre="ubicacion" tamano={15} color={COLORES.primario} />
        <Text style={styles.detalle}>{f.comuna}</Text>
      </View>
      {f.chequeo && <SelloRevisado solidario={f.chequeo.solidario} />}
      {f.personalidad.length > 0 && (
        <View style={styles.chips}>
          {f.personalidad.map((rasgo, i) => {
            const tono = TONOS_TARJETA[TONOS_ESPECIALIDADES[i % TONOS_ESPECIALIDADES.length]];
            return (
              <Text key={rasgo} style={[styles.chip, { backgroundColor: tono.fondo, color: tono.icono }]}>
                {rasgo}
              </Text>
            );
          })}
        </View>
      )}
      {!!f.frase && (
        <View style={styles.frase}>
          <Icono nombre="mensaje" tamano={18} color={TONOS_TARJETA.crema.icono} />
          <Text style={styles.fraseTexto}>“{f.frase}”</Text>
        </View>
      )}
    </View>
  );
}
