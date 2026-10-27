import { useContext } from "react";
import { ConfirmacionContexto } from "../lib/confirmacionContexto";
import type { FuncionConfirmar } from "../interfaces";

// Pide confirmación con el modal de AuraPet (en vez de window.confirm):
//   const confirmar = useConfirmar();
//   if (!(await confirmar(CONFIRMACIONES.borrarNota(nota.titulo)))) return;
export const useConfirmar = (): FuncionConfirmar => {
  const confirmar = useContext(ConfirmacionContexto);
  if (!confirmar) throw new Error("useConfirmar debe usarse dentro de <ConfirmacionProvider>");
  return confirmar;
};
