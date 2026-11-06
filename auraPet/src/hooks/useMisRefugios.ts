import { getMisRefugios } from "../Api/getInfo";
import { useAuth } from "../Auth/AuthContext";
import { useConsulta } from "./useConsulta";

// Refugios que administra la persona conectada (para "Publicar a nombre de…").
export const useMisRefugios = () => {
  const { usuarioActual } = useAuth();
  const { datos } = useConsulta(() => (usuarioActual ? getMisRefugios() : Promise.resolve([])), [usuarioActual?.id]);
  return datos ?? [];
};
