import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { TEXTOS_FICHA_ADOPCION as T } from '@/constants/constants';
import type { PieFichaAdopcionProps } from '@/interfaces';

/** El botón de abajo de la ficha: adoptar, ver mis postulaciones o el estado (ya postulaste, en proceso…). */
export function PieFichaAdopcion({ estado, sexo, onAdoptar, onVerPostulaciones }: PieFichaAdopcionProps) {
  if (estado === 'disponible') return <BotonPrincipal texto={T.quieroAdoptar(sexo)} onPress={onAdoptar} tono="coral" conFlecha />;
  if (estado === 'mia') return <BotonPrincipal texto={T.verPostulaciones} onPress={onVerPostulaciones} conFlecha />;
  return <BotonPrincipal texto={T.botonDeshabilitado[estado]} onPress={onAdoptar} deshabilitado />;
}
