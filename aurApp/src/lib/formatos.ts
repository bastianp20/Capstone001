import { ESPECIE_LABEL, LARGO_TELEFONO_CL, PREFIJO_TELEFONO_CL } from '@/constants/constants';
import type { Mascota } from '@/interfaces';

import { edadDesde } from './fechas';

/** 28 → "28 kg", 4.5 → "4,5 kg" (coma decimal, como se escribe en Chile). */
export const formatearPeso = (pesoKg: number): string => `${pesoKg.toString().replace('.', ',')} kg`;

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
