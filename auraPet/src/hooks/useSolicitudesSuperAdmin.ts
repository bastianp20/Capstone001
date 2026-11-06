import { useCallback, useEffect, useState } from "react";
import { MS_AVISO, TEXTOS_SUPERADMIN } from "../constants";
import { getSolicitudesPendientes } from "../Api/getInfo";
import { resolverSolicitud } from "../Api/postInfo";
import { useAuth } from "../Auth/AuthContext";
import { useAccion } from "./useAccion";
import type { AvisoEstado, SolicitudPendiente, SolicitudesSuperAdmin } from "../interfaces";

// Todo lo de aprobar y rechazar solicitudes, en un solo lugar, para que el
// Resumen, Aprobaciones y la campana usen lo mismo:
//   · carga las pendientes (y las recarga cuando cambia "recarga" o se resuelve una),
//   · aprobar directo (centros y veterinarios) o desde el detalle (solicitudes de centro),
//   · rechazar con motivo (RechazarModal),
//   · un aviso de "aprobada / rechazada" que se cierra solo.
export const useSolicitudesSuperAdmin = (recarga: number): SolicitudesSuperAdmin => {
  const { usuarioActual } = useAuth();
  const [pendientes, setPendientes] = useState<SolicitudPendiente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [version, setVersion] = useState(0);
  const [aviso, setAviso] = useState<AvisoEstado | null>(null);
  const [aRechazar, setARechazar] = useState<SolicitudPendiente | null>(null);
  const [enDetalle, setEnDetalle] = useState<SolicitudPendiente | null>(null);
  const { ejecutar, ocupado, error: errorDetalle } = useAccion();

  // Pendientes: se piden de nuevo al recargar el panel o al resolver una
  useEffect(() => {
    let activo = true;
    getSolicitudesPendientes()
      .then((lista) => { if (activo) setPendientes(lista); })
      .catch((e) => {
        console.error("No se pudieron cargar las solicitudes:", e);
        if (activo) setAviso({ tipo: "error", texto: "No se pudieron cargar las solicitudes." });
      })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [recarga, version]);

  // El aviso se cierra solo después de unos segundos
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), MS_AVISO);
    return () => clearTimeout(t);
  }, [aviso]);

  // Resuelve una solicitud y deja todo al día. Devuelve true si salió bien.
  const resolver = useCallback(async (s: SolicitudPendiente, decision: "aprobado" | "rechazado", motivo?: string) => {
    if (!usuarioActual) return false;
    const ok = await ejecutar(
      () => resolverSolicitud(s.id, decision, usuarioActual.id, motivo),
      decision === "aprobado" ? "No se pudo aprobar la solicitud." : "No se pudo rechazar la solicitud."
    );
    if (ok) {
      setVersion((v) => v + 1);
      setAviso({
        tipo: "ok",
        texto: decision === "aprobado" ? TEXTOS_SUPERADMIN.aprobadaOk(s.nombre) : TEXTOS_SUPERADMIN.rechazadaOk(s.nombre),
      });
    }
    return ok;
  }, [usuarioActual, ejecutar]);

  const aprobar = useCallback(async (s: SolicitudPendiente) => {
    const ok = await resolver(s, "aprobado");
    if (ok) setEnDetalle(null);
    // Aprobar directo (sin modal): si falla, el error se muestra como aviso
    else if (!enDetalle) setAviso({ tipo: "error", texto: "No se pudo aprobar la solicitud." });
  }, [resolver, enDetalle]);

  const confirmarRechazo = useCallback(async (razon: string) => {
    if (!aRechazar) return;
    const ok = await resolver(aRechazar, "rechazado", razon);
    setARechazar(null);
    if (ok) setEnDetalle(null);
    else setAviso({ tipo: "error", texto: "No se pudo rechazar la solicitud." });
  }, [aRechazar, resolver]);

  return {
    pendientes, cargando, version,
    aviso, cerrarAviso: () => setAviso(null),
    aprobar,
    aRechazar, pedirRechazo: setARechazar, cancelarRechazo: () => setARechazar(null), confirmarRechazo,
    enDetalle, abrirDetalle: setEnDetalle, cerrarDetalle: () => setEnDetalle(null),
    ocupado, errorDetalle,
  };
};
