import { useEffect, useState } from "react";
import { estadoUciDesdeFila, getUrgencias } from "../Api/getInfo";
import { supabase } from "../lib/supabase";
import { useConsulta } from "./useConsulta";
import { comunasDe, filtrarCentros, prepararCentros } from "../lib/urgencias";
import type { EstadoUciCentro, FiltrosUrgencias } from "../interfaces";

const SIN_FILTROS: FiltrosUrgencias = { comuna: "", soloAbiertos: false, soloUciDisponible: false };

// página de las urgencias en vivo
export const useUrgencias = () => {
  const { datos, cargando, error } = useConsulta(getUrgencias, []);
  // estados en vivo de los centros con uci 
  const [enVivo, setEnVivo] = useState<Record<number, EstadoUciCentro | null>>({});
  const [ahora, setAhora] = useState(() => new Date());
  const [filtros, setFiltros] = useState<FiltrosUrgencias>(SIN_FILTROS);

  useEffect(() => {
    const canal = supabase
      .channel("urgencias-uci")
      .on("postgres_changes", { event: "*", schema: "public", table: "estado_uci_centros" }, (cambio) => {
        if (cambio.eventType === "DELETE") {
          const id = (cambio.old as { centro_id?: number }).centro_id;
          if (id !== undefined) setEnVivo((e) => ({ ...e, [id]: null }));
        } else {
          const estado = estadoUciDesdeFila(cambio.new as Parameters<typeof estadoUciDesdeFila>[0]);
          setEnVivo((e) => ({ ...e, [estado.centroId]: estado }));
        }
      })
      .subscribe();
    // ésto es el abierto ahora y calcula hace cunto fue que se actualizó el estado de la uci
    const reloj = setInterval(() => setAhora(new Date()), 60_000);
    return () => {
      clearInterval(reloj);
      supabase.removeChannel(canal);
    };
  }, []);

  const centros = prepararCentros(
    (datos?.centros ?? []).map((c) => (c.id in enVivo ? { ...c, estadoUci: c.tieneUci ? enVivo[c.id] : null } : c)),
    ahora,
  );

  return {
    centros: filtrarCentros(centros, filtros),
    veterinarios: (datos?.veterinarios ?? []).filter((v) => !filtros.comuna || v.comunas.includes(filtros.comuna)),
    comunas: comunasDe(datos?.centros ?? []),
    filtros,
    cambiarFiltros: (cambio: Partial<FiltrosUrgencias>) => setFiltros((f) => ({ ...f, ...cambio })),
    ahora,
    cargando,
    error,
  };
};
