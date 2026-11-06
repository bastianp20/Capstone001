// `supabase gen types` marca los parámetros de las funciones SQL como obligatorios
// y no nulos, aunque Postgres sí acepta null (p. ej. "sin centro" o "refugio nuevo").
// Con esto se manda null sin pelear con el tipo generado (y sobrevive a gen:types).
export const nulable = <T,>(valor: T | null): T => valor as T;
