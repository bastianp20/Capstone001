import { useCallback, useRef, useState } from "react";
import { ConfirmacionContexto } from "../../lib/confirmacionContexto";
import type { ConfirmacionProviderProps, OpcionesConfirmacion } from "../../interfaces";
import { ConfirmarModal } from "./ConfirmarModal";

// Envuelve la app (main.tsx) y dibuja un único ConfirmarModal cuando alguien
// llama a confirmar(...). Devuelve una promesa: true = confirmó, false = canceló.
export const ConfirmacionProvider = ({ children }: ConfirmacionProviderProps) => {
  const [opciones, setOpciones] = useState<OpcionesConfirmacion | null>(null);
  const resolver = useRef<((aceptado: boolean) => void) | null>(null);

  const confirmar = useCallback((nuevas: OpcionesConfirmacion) => {
    resolver.current?.(false);               // si había otra abierta, cuenta como cancelada
    setOpciones(nuevas);
    return new Promise<boolean>((resolve) => { resolver.current = resolve; });
  }, []);

  const responder = useCallback((aceptado: boolean) => {
    resolver.current?.(aceptado);
    resolver.current = null;
    setOpciones(null);
  }, []);

  return (
    <ConfirmacionContexto.Provider value={confirmar}>
      {children}
      {opciones && <ConfirmarModal opciones={opciones} onResponder={responder} />}
    </ConfirmacionContexto.Provider>
  );
};
