import { ERROR_AUTH_GENERICO, ERRORES_AUTH } from '@/constants/constants';

/** Mensaje de Supabase (en inglés) → mensaje para el usuario. */
export function traducirErrorAuth(mensaje: string): string {
  const texto = mensaje.toLowerCase();
  const conocido = ERRORES_AUTH.find((e) => texto.includes(e.contiene));
  if (conocido) return conocido.mensaje;
  console.error('Error de autenticación no traducido:', mensaje);
  return ERROR_AUTH_GENERICO;
}
