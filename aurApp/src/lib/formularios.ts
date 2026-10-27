// Ayudas reutilizables para formularios (mismas reglas que la web).

/** ¿Coinciden? Solo avisa cuando ya se escribió algo en la confirmación. */
export const passwordsNoCoinciden = (password: string, confirmacion: string): boolean =>
  confirmacion.length > 0 && password !== confirmacion;

/** Revisión básica de formato; Supabase hace la validación definitiva. */
export const emailValido = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** Deja solo los dígitos del teléfono, como guarda la web. */
export const soloDigitos = (texto: string): string => texto.replace(/\D/g, '');
