// Estado de la UCI de un centro: si sigue vigente y hace cuánto se actualizó (igual que la web).
import { HORAS_VIGENCIA_UCI } from '@/constants/constants';

const MS_MINUTO = 60_000;

export const estadoUciVigente = (actualizadoEn: string, ahora = new Date()) =>
  ahora.getTime() - new Date(actualizadoEn).getTime() < HORAS_VIGENCIA_UCI * 60 * MS_MINUTO;

export const haceCuanto = (iso: string, ahora = new Date()) => {
  const min = Math.max(0, Math.floor((ahora.getTime() - new Date(iso).getTime()) / MS_MINUTO));
  if (min < 1) return 'hace un momento';
  if (min < 60) return `hace ${min} min`;
  const horas = Math.floor(min / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return dias === 1 ? 'hace 1 día' : `hace ${dias} días`;
};
