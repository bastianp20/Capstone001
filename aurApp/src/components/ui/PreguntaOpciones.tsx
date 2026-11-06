import type { PreguntaOpcionesProps } from '@/interfaces';

import { ChipsOpcion } from './ChipsOpcion';
import { GrupoCampo } from './GrupoCampo';

/** Una pregunta de formulario con chips para elegir una respuesta. */
export function PreguntaOpciones<V extends string>({ titulo, error, ...chips }: PreguntaOpcionesProps<V>) {
  return (
    <GrupoCampo titulo={titulo} error={error}>
      <ChipsOpcion {...chips} />
    </GrupoCampo>
  );
}
