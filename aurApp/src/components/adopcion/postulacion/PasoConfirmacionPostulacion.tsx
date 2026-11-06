import { Text, View } from 'react-native';

import { Casilla } from '@/components/ui/Casilla';
import { TarjetaAviso } from '@/components/ui/TarjetaAviso';
import { TarjetaListaIconos } from '@/components/ui/TarjetaListaIconos';
import { TEXTOS_POSTULACION as T, TEXTOS_POSTULANTES } from '@/constants/constants';
import { usePostularAdopcionStyles } from '@/css/PostularAdopcionPage';
import type { PasoConfirmacionPostulacionProps } from '@/interfaces';
import { lineasFamilia, lineasHogar } from '@/lib/adopcion';

/** Paso 4 · Confirmar: resumen de lo que respondió, aviso de contacto y el compromiso. */
export function PasoConfirmacionPostulacion({ datos: d, errores: e, onCambiar, nombreAnimal }: PasoConfirmacionPostulacionProps) {
  const styles = usePostularAdopcionStyles();
  return (
    <View style={styles.paso}>
      <TarjetaListaIconos titulo={TEXTOS_POSTULANTES.hogar} items={lineasHogar(d)} />
      <TarjetaListaIconos titulo={TEXTOS_POSTULANTES.familia} items={lineasFamilia(d)} />
      <TarjetaListaIconos titulo={TEXTOS_POSTULANTES.porQue} items={[{ icono: 'mensaje', texto: d.motivo.trim() }]} />
      <TarjetaAviso icono="telefono" texto={T.avisoContacto} />
      <View>
        <Casilla texto={T.compromiso(nombreAnimal)} marcada={d.aceptaCompromiso} onCambiar={(v) => onCambiar('aceptaCompromiso', v)} />
        {e.aceptaCompromiso && <Text style={styles.error}>{e.aceptaCompromiso}</Text>}
      </View>
    </View>
  );
}
