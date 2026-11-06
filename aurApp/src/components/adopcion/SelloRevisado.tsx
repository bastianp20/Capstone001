import { Text, View } from 'react-native';

import { TEXTOS_ADOPTA as T } from '@/constants/constants';
import { useSelloRevisadoStyles } from '@/css/AdoptaPage';
import type { SelloRevisadoProps } from '@/interfaces';

import { Icono } from '@/components/ui/Icono';
import { useColores } from '@/context/TemaContext';

/** Sello "Revisado por veterinario" (o "Chequeo solidario"). */
export function SelloRevisado({ solidario = false, compacto = false }: SelloRevisadoProps) {
  const COLORES = useColores();
  const styles = useSelloRevisadoStyles();
  const texto = solidario ? T.solidario : compacto ? T.revisadoCorto : T.revisado;
  return (
    <View style={styles.sello}>
      <Icono nombre={solidario ? 'corazon' : 'escudo'} tamano={13} color={COLORES.primarioOscuro} grosor={2.4} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}
