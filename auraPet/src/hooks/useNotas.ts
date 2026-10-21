import { useState } from "react";
import { getNotas } from "../Api/getInfo";
import { actualizarNota, borrarNota, crearNota } from "../Api/postInfo";
import type { DatosNota, Nota } from "../interfaces";
import { useAccion } from "./useAccion";
import { useConsulta } from "./useConsulta";

// Notas de la persona conectada: las pide y ofrece crear, editar, fijar y
// borrar. Después de cada cambio vuelve a pedir la lista.
export const useNotas = () => {
  const [recarga, setRecarga] = useState(0);
  const { datos: notas = [], cargando, error } = useConsulta(() => getNotas(), [recarga]);
  const { ejecutar, ocupado, error: errorAccion } = useAccion();

  const correr = async (accion: () => Promise<void>, mensaje: string) => {
    const ok = await ejecutar(accion, mensaje);
    if (ok) setRecarga((n) => n + 1);
    return ok;
  };

  return {
    notas,
    cargando,
    error: error ?? errorAccion,
    ocupado,
    crear: (datos: DatosNota) => correr(() => crearNota(datos), "No se pudo guardar la nota."),
    editar: (nota: Nota, datos: DatosNota) => correr(() => actualizarNota(nota.id, datos), "No se pudo guardar la nota."),
    alternarFijada: (nota: Nota) => correr(() => actualizarNota(nota.id, { fijada: !nota.fijada }), "No se pudo fijar la nota."),
    borrar: (nota: Nota) => correr(() => borrarNota(nota.id), "No se pudo borrar la nota."),
  };
};
