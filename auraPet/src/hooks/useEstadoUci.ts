import { useEffect, useState } from "react";
import { estadoUciDesdeFila, getEstadoUci } from "../Api/getInfo";
import { actualizarEstadoUci } from "../Api/postInfo";
import { supabase } from "../lib/supabase";
import { useAccion } from "./useAccion";
import type { DatosEstadoUci, EstadoUciCentro } from "../interfaces";

// Estado de la UCI de un centro, EN VIVO: carga el actual y se suscribe a
// Supabase Realtime, así un cambio (de esta u otra persona) se ve al instante.
// Sirve para el panel del centro y, después, para la página de urgencias.
export const useEstadoUci = (centroId: number) => {
  const [estado, setEstado] = useState<EstadoUciCentro | null>(null);
  const [cargando, setCargando] = useState(true);
  // "ahora" para "actualizado hace X": se refresca cada minuto
  const [ahora, setAhora] = useState(() => new Date());
  const { ejecutar, ocupado, error } = useAccion();

  useEffect(() => {
    let activo = true;
    getEstadoUci(centroId)
      .then((e) => { if (activo) setEstado(e); })
      .catch((e: unknown) => console.error(e))
      .finally(() => { if (activo) setCargando(false); });

    const canal = supabase
      .channel(`estado-uci-${centroId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "estado_uci_centros", filter: `centro_id=eq.${centroId}` },
        (cambio) => {
          if (cambio.eventType === "DELETE") setEstado(null);
          else setEstado(estadoUciDesdeFila(cambio.new as Parameters<typeof estadoUciDesdeFila>[0]));
        })
      .subscribe();

    const reloj = setInterval(() => setAhora(new Date()), 60_000);
    return () => {
      activo = false;
      clearInterval(reloj);
      supabase.removeChannel(canal);
    };
  }, [centroId]);

  const actualizar = async (datos: DatosEstadoUci) => {
    if (await ejecutar(() => actualizarEstadoUci(centroId, datos), "No se pudo actualizar el estado.")) {
      // Realtime lo trae igual; esto es para que se vea aunque Realtime esté apagado
      setEstado(await getEstadoUci(centroId));
      setAhora(new Date());
    }
  };

  return { estado, cargando, ahora, actualizar, ocupado, error };
};
