import { useState } from "react";
import { getAvisosCitas } from "../Api/getInfo";
import { marcarAvisoLeido } from "../Api/postInfo";
import { useConsulta } from "./useConsulta";

// Avisos sin leer de cambios de hora (dueño o administración de un centro).
// Al marcarlos como leídos desaparecen de la lista.
export const useAvisosCitas = (centroId?: number) => {
  const [recarga, setRecarga] = useState(0);
  const { datos: avisos = [] } = useConsulta(() => getAvisosCitas(centroId), [centroId, recarga]);
  const [ocupado, setOcupado] = useState(false);

  const marcar = async (ids: number[]) => {
    setOcupado(true);
    try {
      await Promise.all(ids.map((id) => marcarAvisoLeido(id)));
    } catch (e) {
      console.error(e);
    } finally {
      setOcupado(false);
      setRecarga((n) => n + 1);
    }
  };

  return {
    avisos,
    ocupado,
    marcarLeido: (id: number) => marcar([id]),
    marcarTodos: () => marcar(avisos.map((a) => a.id)),
  };
};
