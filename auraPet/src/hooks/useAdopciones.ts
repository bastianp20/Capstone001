import { useMemo } from "react";
import { getAnimalesAdopcion, getHistoriasAdopcion, getResumenAdopciones } from "../Api/getInfo";
import type { EstadisticasAdopcion } from "../interfaces";
import { elegirDestacado } from "../lib/adopcion";
import { useConsulta } from "./useConsulta";

const SIN_NUMEROS: EstadisticasAdopcion = { esperando: 0, revisados: 0, conFamilia: 0 };

// Datos de la página /adopta (desde la base): animales esperando hogar,
// historias de éxito, los números del hero y el destacado de la semana.
export const useAdopciones = () => {
  const animales = useConsulta(getAnimalesAdopcion, []);
  const historias = useConsulta(getHistoriasAdopcion, []);
  const resumen = useConsulta(getResumenAdopciones, []);

  const lista = useMemo(() => animales.datos ?? [], [animales.datos]);

  return {
    animales: lista,
    historias: historias.datos ?? [],
    estadisticas: resumen.datos ?? SIN_NUMEROS,
    destacado: useMemo(() => elegirDestacado(lista), [lista]),
    cargando: animales.cargando,
    error: animales.error,
  };
};
