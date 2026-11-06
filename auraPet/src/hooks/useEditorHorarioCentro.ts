import { useState } from "react";
import { guardarHorarioCentro } from "../Api/postInfo";
import { useAccion } from "./useAccion";
import { diasDesdeHorarios, horariosDesdeDias, validarDiasCentro } from "../lib/horarioCentro";
import type { CentroDetalle, DiaFormulario } from "../interfaces";

// Editar el horario del centro desde "Mi centro": parte del guardado, se edita
// día por día y se guarda todo junto.
export const useEditorHorarioCentro = (centro: CentroDetalle, onGuardado: () => void) => {
  const [editando, setEditando] = useState(false);
  const [dias, setDias] = useState<DiaFormulario[]>(() => diasDesdeHorarios(centro.horarios));
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const { ejecutar, ocupado, error } = useAccion();

  const empezar = () => {
    setDias(diasDesdeHorarios(centro.horarios));
    setErrorForm(null);
    setEditando(true);
  };

  const cambiarDia = (dia: number, cambio: Partial<DiaFormulario>) =>
    setDias((actuales) => actuales.map((d) => (d.dia === dia ? { ...d, ...cambio } : d)));

  const guardar = async () => {
    const problema = validarDiasCentro(dias);
    setErrorForm(problema);
    if (problema) return;
    if (await ejecutar(() => guardarHorarioCentro(centro.id, horariosDesdeDias(dias)), "No se pudo guardar el horario.")) {
      setEditando(false);
      onGuardado();
    }
  };

  return { editando, empezar, cancelar: () => setEditando(false), dias, cambiarDia, guardar, ocupado, error: errorForm ?? error };
};
