import { jsPDF } from "jspdf";
import { FORMATO_PDF, TEXTOS_PDF as T } from "../../constants";
import { fechaDentroDe } from "../fechas";
import type { FichaPdf, TipoPdfFicha } from "../../interfaces";
import { dibujarFichaCompleta, dibujarReceta, dibujarResumen } from "./documentos";
import { cargarLogo } from "./logo";

// Punto de entrada de los PDF. Se carga con import() solo cuando alguien
// descarga, así jsPDF no pesa en la carga inicial de la app.

// "Bruno Pérez" -> "bruno-perez" (para el nombre del archivo)
const enSlug = (texto: string) =>
  texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const nuevoDocumento = () => new jsPDF({ unit: "mm", format: FORMATO_PDF });

export const descargarFicha = async (ficha: FichaPdf, tipo: TipoPdfFicha) => {
  const [doc, logo] = [nuevoDocumento(), await cargarLogo()];
  if (tipo === "completa") dibujarFichaCompleta(doc, ficha, logo);
  else dibujarResumen(doc, ficha, logo);
  doc.save(T.archivo(tipo === "completa" ? "ficha" : "resumen", enSlug(ficha.paciente.nombre), fechaDentroDe(0)));
};

export const descargarReceta = async (ficha: FichaPdf, recetaId: number) => {
  const receta = ficha.recetas.find((r) => r.id === recetaId);
  if (!receta) throw new Error("No se encontró la receta.");
  const [doc, logo] = [nuevoDocumento(), await cargarLogo()];
  dibujarReceta(doc, ficha, receta, logo);
  doc.save(T.archivo(`receta-${receta.id}`, enSlug(ficha.paciente.nombre), fechaDentroDe(0)));
};
