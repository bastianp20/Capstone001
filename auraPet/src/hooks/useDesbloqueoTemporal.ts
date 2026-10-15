import { useCallback, useState } from "react";
import { SEGUNDOS_DESBLOQUEO_CUENTA_REAL } from "../constants";
import { useCuentaRegresiva } from "./useCuentaRegresiva";

// Candado temporal para editar registros REALES (cuentas, centros) desde el superadmin.
//
//   const candado = useDesbloqueoTemporal(esReal);
//   candado.desbloqueado   -> true si es de prueba, o si se escribió el código hace < 60 s
//   candado.desbloquear()  -> abre la ventana de 60 s (lo llama DesbloqueoCuentaReal)
//   candado.tiempo         -> "0:42" para mostrar la cuenta regresiva
//   candado.intento        -> úsalo como "key" del candado: cambia al re-bloquearse (código nuevo)
//   candado.confirmando    -> paso "Vas a cambiar..." antes de guardar
//
// Es una protección contra errores, no la seguridad: esa la pone la base (RLS).
export const useDesbloqueoTemporal = (protegido: boolean) => {
  const [intento, setIntento] = useState(0);
  const [confirmando, setConfirmando] = useState(false);

  // Al acabarse el tiempo: se bloquea de nuevo (también si estaba confirmando)
  const alTerminar = useCallback(() => {
    setConfirmando(false);
    setIntento((n) => n + 1);
  }, []);
  const { restante, iniciar } = useCuentaRegresiva(alTerminar);

  return {
    desbloqueado: !protegido || restante > 0,
    desbloquear: () => iniciar(SEGUNDOS_DESBLOQUEO_CUENTA_REAL),
    tiempo: `${Math.floor(restante / 60)}:${String(restante % 60).padStart(2, "0")}`,
    intento,
    confirmando,
    setConfirmando,
  };
};
