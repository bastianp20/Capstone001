import { getFichaPdf } from "../Api/getInfo";
import type { TipoPdfFicha } from "../interfaces";
import { useAccion } from "./useAccion";

// Descarga la ficha médica (completa o resumen) o una receta en PDF.
// Pide los datos a la base (ficha_pdf) y carga el generador solo al usarlo.
export const useDescargaPdf = () => {
  const { ejecutar, ocupado, error } = useAccion();

  const descargarFicha = (mascotaId: number, tipo: TipoPdfFicha) =>
    ejecutar(async () => {
      const [ficha, pdf] = await Promise.all([getFichaPdf(mascotaId), import("../lib/pdf/generarPdf")]);
      await pdf.descargarFicha(ficha, tipo);
    }, "No se pudo generar el PDF.");

  const descargarReceta = (mascotaId: number, recetaId: number) =>
    ejecutar(async () => {
      const [ficha, pdf] = await Promise.all([getFichaPdf(mascotaId), import("../lib/pdf/generarPdf")]);
      await pdf.descargarReceta(ficha, recetaId);
    }, "No se pudo generar el PDF de la receta.");

  return { descargarFicha, descargarReceta, ocupado, error };
};
