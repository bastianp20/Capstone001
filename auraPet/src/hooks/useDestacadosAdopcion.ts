import { useMemo } from "react";
import { getAnimalesAdopcion } from "../Api/getInfo";
import { MAX_ADOPCION_LOGIN } from "../constants";
import { useConsulta } from "./useConsulta";

// Animales para el apartado "Ellos también buscan hogar" del login:
// solo los disponibles (no los que están en proceso), hasta MAX_ADOPCION_LOGIN.
export const useDestacadosAdopcion = () => {
  const { datos } = useConsulta(getAnimalesAdopcion, []);
  const disponibles = useMemo(() => (datos ?? []).filter((a) => a.estado === "disponible"), [datos]);
  return {
    animales: useMemo(() => disponibles.slice(0, MAX_ADOPCION_LOGIN), [disponibles]),
    total: disponibles.length,
  };
};
