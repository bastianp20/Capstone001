import { useCallback, useMemo, useState } from "react";
import { getCasosModeracion, getResumenModeracion } from "../Api/getInfo";
import { resolverModeracion } from "../Api/postInfo";
import { CONFIRMACIONES, TEXTOS_MODERACION as T } from "../constants";
import type { CasoModeracion, DecisionModeracion, EstadoCasoModeracion } from "../interfaces";
import { useAccion } from "./useAccion";
import { useConfirmar } from "./useConfirmar";
import { useConsulta } from "./useConsulta";

// Superadmin → Moderación: casos por estado, el caso abierto y las decisiones.
// Ocultar y advertir piden un mensaje (abre el diálogo); descartar solo confirma.
export const useModeracion = (onCambio: () => void) => {
  const [estado, setEstado] = useState<EstadoCasoModeracion>("pendiente");
  const [recarga, setRecarga] = useState(0);
  const casos = useConsulta(() => getCasosModeracion(estado), [estado, recarga]);
  const resumen = useConsulta(getResumenModeracion, [recarga]);
  const [elegidoId, setElegidoId] = useState<number | null>(null);
  const [dialogo, setDialogo] = useState<Exclude<DecisionModeracion, "descartar"> | null>(null);
  const confirmar = useConfirmar();
  const accion = useAccion();

  const lista = useMemo(() => casos.datos ?? [], [casos.datos]);
  // Si no eligió uno (o el elegido ya no está en la lista), se abre el primero
  const caso = lista.find((c) => c.adopcionId === elegidoId) ?? lista[0] ?? null;

  const resolver = useCallback(
    async (decision: DecisionModeracion, mensaje = "") => {
      if (!caso) return;
      const ok = await accion.ejecutar(() => resolverModeracion(caso.adopcionId, decision, mensaje), T.errorAccion);
      setDialogo(null);
      if (ok) {
        setRecarga((n) => n + 1);
        onCambio();
      }
    },
    [caso, accion, onCambio],
  );

  const decidir = useCallback(
    async (decision: DecisionModeracion) => {
      if (decision !== "descartar") return setDialogo(decision);
      if (caso && (await confirmar(CONFIRMACIONES.descartarReporte(caso.nombre)))) resolver("descartar");
    },
    [caso, confirmar, resolver],
  );

  return {
    estado,
    cambiarEstado: (e: EstadoCasoModeracion) => {
      setEstado(e);
      setElegidoId(null);
    },
    casos: lista,
    caso,
    elegir: (c: CasoModeracion) => setElegidoId(c.adopcionId),
    resumen: resumen.datos ?? { porRevisar: 0, urgentes: 0, horasRespuesta: null, ocultas: 0 },
    cargando: casos.cargando,
    error: casos.error,
    dialogo,
    cerrarDialogo: () => setDialogo(null),
    decidir,
    resolver,
    ocupado: accion.ocupado,
    errorAccion: accion.error,
  };
};
