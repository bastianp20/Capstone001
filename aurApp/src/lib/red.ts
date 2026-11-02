// ¿El error fue por falta de conexión? (para mostrar "Sin conexión" y ofrecer reintentar). Sin estado.
const SIN_RED = /network request failed|failed to fetch|fetch failed|network error|timeout|offline/i;

export const esErrorDeRed = (mensaje: string): boolean => SIN_RED.test(mensaje);
