import { useCallback, useMemo, useState } from "react";
import { registrarAtencionAdopcion } from "../Api/postInfo";
import { datosAtencionVacios, MIN_RESUMEN_ATENCION, TEXTOS_REGISTRAR_ATENCION as T } from "../constants";
import type { CentroAtencion, DatosAtencionAdopcion, ProcedimientoAtencion } from "../interfaces";
import { fechaDentroDe } from "../lib/fechas";
import { useAccion } from "./useAccion";

type ErroresAtencion = Partial<Record<"resumen" | "pesoKg" | "monto", string>>;

const validar = (d: DatosAtencionAdopcion): ErroresAtencion => {
  const e: ErroresAtencion = {};
  if (d.resumen.trim().length < MIN_RESUMEN_ATENCION) e.resumen = T.errorResumen;
  const peso = Number(d.pesoKg.replace(",", "."));
  if (d.pesoKg.trim() && !(peso > 0 && peso < 150)) e.pesoKg = T.errorPeso;
  if (!d.solidario && d.monto.trim() && !/^\d[\d.]*$/.test(d.monto.trim())) e.monto = T.errorMonto;
  return e;
};

// Formulario "Registrar atención": datos, validación y guardado.
export const useRegistrarAtencion = (adopcionId: number, centros: CentroAtencion[], onGuardada: () => void) => {
  const [datos, setDatos] = useState<DatosAtencionAdopcion>(() => datosAtencionVacios(fechaDentroDe(0), centros[0]?.id ?? null));
  const [intento, setIntento] = useState(false);
  const accion = useAccion();

  const errores = useMemo(() => (intento ? validar(datos) : {}), [intento, datos]);
  const cambiar = useCallback((c: Partial<DatosAtencionAdopcion>) => setDatos((d) => ({ ...d, ...c })), []);
  const alternarProcedimiento = useCallback(
    (p: ProcedimientoAtencion) =>
      setDatos((d) => ({
        ...d,
        procedimientos: d.procedimientos.includes(p) ? d.procedimientos.filter((x) => x !== p) : [...d.procedimientos, p],
      })),
    [],
  );

  const guardar = useCallback(async () => {
    setIntento(true);
    if (Object.keys(validar(datos)).length) return;
    if (await accion.ejecutar(() => registrarAtencionAdopcion(adopcionId, datos), T.error)) onGuardada();
  }, [datos, accion, adopcionId, onGuardada]);

  return { datos, cambiar, alternarProcedimiento, errores, guardar, guardando: accion.ocupado, error: accion.error };
};
