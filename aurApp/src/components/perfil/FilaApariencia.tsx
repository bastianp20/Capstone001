import { useState } from 'react';

import { FilaOpcion } from '@/components/ui/FilaOpcion';
import { OPCIONES_APARIENCIA, TEXTOS_APARIENCIA as T } from '@/constants/constants';
import { useTema } from '@/context/TemaContext';

import { HojaApariencia } from './HojaApariencia';

/** Fila "Apariencia" del perfil (todos los roles): muestra la elegida y abre la hoja para cambiarla. */
export function FilaApariencia() {
  const { preferencia } = useTema();
  const [abierta, setAbierta] = useState(false);
  const actual = OPCIONES_APARIENCIA.find((o) => o.valor === preferencia) ?? OPCIONES_APARIENCIA[2];
  return (
    <>
      <FilaOpcion icono={actual.icono} tono="lavanda" texto={T.titulo} valor={actual.texto} onPress={() => setAbierta(true)} />
      <HojaApariencia visible={abierta} onCerrar={() => setAbierta(false)} />
    </>
  );
}
