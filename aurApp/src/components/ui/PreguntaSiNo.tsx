import { OPCIONES_SI_NO } from '@/constants/constants';
import type { PreguntaSiNoProps } from '@/interfaces';

import { PreguntaOpciones } from './PreguntaOpciones';

/** Pregunta de Sí o No (sin respuesta al principio: null). */
export function PreguntaSiNo({ titulo, valor, onCambiar, error }: PreguntaSiNoProps) {
  return (
    <PreguntaOpciones
      titulo={titulo}
      error={error}
      opciones={OPCIONES_SI_NO}
      valor={valor === null ? null : valor ? 'si' : 'no'}
      onCambiar={(v) => v && onCambiar(v === 'si')}
    />
  );
}
