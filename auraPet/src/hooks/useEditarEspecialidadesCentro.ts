import { useState } from "react";
import { getEspecialidades } from "../Api/getInfo";
import { guardarEspecialidadesCentro } from "../Api/postInfo";
import { useAccion } from "./useAccion";
import { useConsulta } from "./useConsulta";
import type { CentroDetalle } from "../interfaces";

// Editar las especialidades del centro (chips de selección múltiple).
export const useEditarEspecialidadesCentro = (centro: CentroDetalle, onGuardado: () => void) => {
  const [editando, setEditando] = useState(false);
  const [seleccion, setSeleccion] = useState<number[]>(centro.especialidadIds);
  const { datos: catalogo = [] } = useConsulta(() => (editando ? getEspecialidades() : Promise.resolve([])), [editando]);
  const { ejecutar, ocupado, error } = useAccion();

  const empezar = () => {
    setSeleccion(centro.especialidadIds);
    setEditando(true);
  };

  const guardar = async () => {
    if (await ejecutar(() => guardarEspecialidadesCentro(centro.id, seleccion), "No se pudieron guardar las especialidades.")) {
      setEditando(false);
      onGuardado();
    }
  };

  return { editando, empezar, cancelar: () => setEditando(false), catalogo, seleccion, setSeleccion, guardar, ocupado, error };
};
