import { ContadorNumero } from '@/components/ui/ContadorNumero';
import { PASO_PESO_KG, TEXTOS_REGISTRO_ATENCION as T } from '@/constants/constants';
import type { ContadorPesoProps } from '@/interfaces';
import { formatearPeso } from '@/lib/formatos';

/** Peso con botones − y + (de a 0,1 kg). Sin peso registrado parte en 0. */
export function ContadorPeso({ valor, onCambiar }: ContadorPesoProps) {
  return <ContadorNumero valor={valor} onCambiar={onCambiar} paso={PASO_PESO_KG} formato={formatearPeso} textoVacio={T.sinPeso} />;
}
