import { ESPECIE_LABEL, LARGO_TELEFONO_CL, PREFIJO_TELEFONO_CL } from '@/constants/constants';
import type { Mascota } from '@/interfaces';

import { edadDesde } from './fechas';

/** Decimales de un paso: 0.1 → 1, 0.25 → 2, 1 → 0. */
const decimalesDe = (paso: number): number => (paso.toString().split('.')[1] ?? '').length;

/**
 * Suma o resta un paso sin el error de decimales del computador (0,1 + 0,2 = 0,30000000000000004):
 * el resultado se redondea a los decimales del paso y se mantiene entre el mínimo y el máximo.
 */
export const sumarPaso = (valor: number, paso: number, minimo: number, maximo?: number): number => {
  const d = decimalesDe(paso);
  const redondo = Number((valor + paso).toFixed(d));
  return Math.min(maximo ?? Infinity, Math.max(minimo, redondo));
};

/** Lleva un número al múltiplo del paso más cercano, sin decimales de más (0,30000000000000004 → 0,3). */
export const redondearAlPaso = (valor: number, paso: number): number =>
  Number((Math.round(valor / paso) * paso).toFixed(decimalesDe(paso)));

/** 28 → "28 kg", 4.5 → "4,5 kg" (coma decimal, como se escribe en Chile; máximo 2 decimales). */
export const formatearPeso = (pesoKg: number): string => `${Number(pesoKg.toFixed(2)).toString().replace('.', ',')} kg`;

/** "Labrador · 4 años · 28 kg" (lo que se sepa; si no hay raza, la especie). */
export const descripcionMascota = (m: Mascota): string =>
  [m.raza || ESPECIE_LABEL[m.especie], edadDesde(m.fechaNacimiento), m.pesoKg !== null ? formatearPeso(m.pesoKg) : null]
    .filter(Boolean)
    .join(' · ');

/** 56912345678 → "912345678" (para editarlo en el formulario, sin el +56). */
export const telefonoParaEditar = (telefono: number | null): string => {
  if (!telefono) return '';
  const texto = telefono.toString();
  return texto.startsWith(PREFIJO_TELEFONO_CL) && texto.length > LARGO_TELEFONO_CL ? texto.slice(PREFIJO_TELEFONO_CL.length) : texto;
};

/** 12.5 → "12,5" (para el formulario de mascota). */
export const pesoParaEditar = (pesoKg: number | null): string => (pesoKg === null ? '' : pesoKg.toString().replace('.', ','));

/** 29990 → "$29.990" (separador de miles chileno, sin depender de Intl). */
export const formatearPrecio = (monto: number): string => `$${Math.round(monto).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

/** 56912345678 → "+56912345678" (como lo guarda la base, con el +). */
export const formatearTelefono = (telefono: number | null): string | null => (telefono ? `+${telefono}` : null);
