import type { SyntheticEvent } from "react";

// Ayudas reutilizables para formularios.

const impedir = (e: SyntheticEvent) => e.preventDefault();

// Para campos de contraseña: no deja copiar, cortar, pegar ni arrastrar texto,
// así la confirmación hay que escribirla a mano.
//   <input type="password" {...bloquearCopiarPegar} />
export const bloquearCopiarPegar = {
  onCopy: impedir,
  onCut: impedir,
  onPaste: impedir,
  onDrop: impedir,
};

// ¿Coinciden? Solo avisa cuando ya se escribió algo en la confirmación.
export const passwordsNoCoinciden = (password: string, confirmacion: string): boolean =>
  confirmacion.length > 0 && password !== confirmacion;
