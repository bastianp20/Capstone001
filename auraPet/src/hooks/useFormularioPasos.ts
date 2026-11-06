import { useCallback, useMemo, useState } from "react";
import type { ErroresFormulario, OpcionesFormularioPasos } from "../interfaces";

// Formulario por pasos genérico (sirve para postular, publicar y los que vengan).
//   const f = useFormularioPasos({ inicial, pasos, validar });
//   f.actualizar("nombre", "Luna");  f.avanzar();  f.retroceder();
// · Un error solo se muestra si se intentó avanzar desde su paso (así no parte en rojo).
// · avanzar() devuelve true si el paso estaba bien (y pasa al siguiente, si hay).
export const useFormularioPasos = <D extends object, C extends Extract<keyof D, string>>({
  inicial,
  pasos,
  validar,
}: OpcionesFormularioPasos<D, C>) => {
  const [datos, setDatos] = useState<D>(inicial);
  const [paso, setPaso] = useState(0);
  const [revisados, setRevisados] = useState<Set<C>>(new Set());

  const todos = useMemo(() => validar(datos), [datos, validar]);
  const errores = useMemo<ErroresFormulario<C>>(
    () => Object.fromEntries(Object.entries(todos).filter(([c]) => revisados.has(c as C))) as ErroresFormulario<C>,
    [todos, revisados],
  );

  const actualizar = useCallback(<K extends C>(campo: K, valor: D[K]) => {
    setDatos((d) => ({ ...d, [campo]: valor }));
  }, []);

  const avanzar = useCallback((): boolean => {
    const { campos } = pasos[paso];
    setRevisados((r) => new Set([...r, ...campos]));
    const ok = campos.every((c) => !todos[c]);
    if (ok && paso < pasos.length - 1) setPaso(paso + 1);
    return ok;
  }, [paso, pasos, todos]);

  const retroceder = useCallback(() => setPaso((p) => Math.max(0, p - 1)), []);

  const reiniciar = useCallback(() => {
    setDatos(inicial);
    setPaso(0);
    setRevisados(new Set());
  }, [inicial]);

  return {
    datos,
    actualizar,
    paso,
    pasoActual: pasos[paso],
    esPrimero: paso === 0,
    esUltimo: paso === pasos.length - 1,
    avanzar,
    retroceder,
    reiniciar,
    errores,
    valido: Object.keys(todos).length === 0,
  };
};
