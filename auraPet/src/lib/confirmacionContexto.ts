import { createContext } from "react";
import type { FuncionConfirmar } from "../interfaces";

// Contexto del modal de confirmación. Lo llena ConfirmacionProvider y se lee
// con el hook useConfirmar() (separado para que el archivo del componente
// solo exporte componentes).
export const ConfirmacionContexto = createContext<FuncionConfirmar | null>(null);
