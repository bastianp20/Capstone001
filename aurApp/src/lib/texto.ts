/** Quita tildes y pasa a minúsculas: "María" → "maria", para buscar sin importar acentos. */
export const normalizar = (texto: string): string =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** "bastian" → "Bastian" (solo la primera letra). */
export const capitalizar = (texto: string): string =>
  texto ? texto.charAt(0).toLocaleUpperCase('es-CL') + texto.slice(1) : texto;

/** "bastian palavecino" → "Bastian". */
export const primerNombre = (nombreCompleto: string): string => capitalizar(nombreCompleto.trim().split(/\s+/)[0] ?? '');

/** "bastian palavecino" → "Bastian Palavecino". */
export const nombrePropio = (nombreCompleto: string): string =>
  nombreCompleto.trim().split(/\s+/).map(capitalizar).join(' ');

/** "Bastian Palavecino" → "BP" (máximo dos letras). */
export const iniciales = (nombreCompleto: string): string =>
  nombreCompleto
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toLocaleUpperCase('es-CL'))
    .join('');
