// "Completa tu perfil" (veterinario y centro): qué pasos faltan y el porcentaje.

/** Pasos que faltan, en el orden dado. Un paso que no viene (por ejemplo "zona" si no es independiente) no cuenta. */
export const pasosPendientes = <P extends string>(orden: readonly P[], pasos: Partial<Record<P, boolean>>): P[] =>
  orden.filter((p) => pasos[p] === false);

export const porcentajePerfil = <P extends string>(orden: readonly P[], pasos: Partial<Record<P, boolean>>): number => {
  const cuentan = orden.filter((p) => pasos[p] !== undefined);
  if (cuentan.length === 0) return 100;
  return Math.round((cuentan.filter((p) => pasos[p]).length / cuentan.length) * 100);
};
