import { useCallback, useState } from "react";
import { getEspecialidades, getMisEspecialidades } from "../Api/getInfo";
import { guardarMisEspecialidades } from "../Api/postInfo";
import { TEXTOS_MIS_ESPECIALIDADES as T } from "../constants";
import type { MisEspecialidades } from "../interfaces";
import { useAccion } from "./useAccion";
import { useConsulta } from "./useConsulta";

// Configuración → "Mis especialidades" (veterinario): las marca sin límite y las guarda.
export const useMisEspecialidades = (onGuardado: () => void) => {
  const { datos: catalogo = [] } = useConsulta(getEspecialidades, []);
  const guardadas = useConsulta(getMisEspecialidades, []);
  // Lo que va cambiando (null = todavía igual a lo guardado)
  const [cambios, setCambios] = useState<MisEspecialidades | null>(null);
  const actual: MisEspecialidades = cambios ?? guardadas.datos ?? { ids: [], otra: "" };
  const { ejecutar, ocupado, error } = useAccion();

  const cambiar = useCallback(
    (c: { especialidadIds?: number[]; especialidadOtra?: string }) =>
      setCambios({ ids: c.especialidadIds ?? actual.ids, otra: c.especialidadOtra ?? actual.otra }),
    [actual.ids, actual.otra],
  );

  const guardar = async () => {
    if (await ejecutar(() => guardarMisEspecialidades(actual.ids, actual.otra), T.error)) onGuardado();
  };

  return { catalogo, ids: actual.ids, otra: actual.otra, cambiar, guardar, cargando: guardadas.cargando, ocupado, error };
};
