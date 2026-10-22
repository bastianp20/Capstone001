import type { jsPDF } from "jspdf";
import { MAX_REGISTROS_RESUMEN_PDF, TEXTOS_PDF as T } from "../../constants";
import type { FichaPdf, RecetaFicha } from "../../interfaces";
import {
  bloqueAlertas, bloqueDerivaciones, bloqueHistorial, bloquePaciente, bloqueReceta, bloqueRecetas, bloqueVacunas,
} from "./bloques";
import { crearLienzo, encabezado, finalizar, firma, texto, tituloSeccion } from "./plantilla";

// =====================================================================
// Los tres documentos de AuraPet (diseño de la ficha médica):
//   · ficha completa (varias páginas)
//   · resumen de ficha (1 página)
//   · receta (1 página, con firma y N° de colegiado)
// =====================================================================

const encabezadoCorto = (titulo: string, codigo: string) => `${titulo} ${codigo}`;

export const dibujarFichaCompleta = (doc: jsPDF, ficha: FichaPdf, logo: string | null) => {
  const l = crearLienzo(doc);
  encabezado(l, logo, T.tituloFicha, ficha.codigo, ficha.emitida);
  bloquePaciente(l, ficha, "1.");
  bloqueAlertas(l, ficha, "2.");
  bloqueVacunas(l, ficha, "3.");
  bloqueHistorial(l, ficha, `4. ${T.historial}`);
  bloqueRecetas(l, ficha, "5.");
  bloqueDerivaciones(l, ficha, "6.");
  finalizar(l, encabezadoCorto(T.cortoFicha, ficha.codigo));
};

export const dibujarResumen = (doc: jsPDF, ficha: FichaPdf, logo: string | null) => {
  const l = crearLienzo(doc);
  encabezado(l, logo, T.tituloResumen, ficha.codigo, ficha.emitida);
  bloquePaciente(l, ficha, "1.");
  bloqueAlertas(l, ficha, "2.");
  bloqueVacunas(l, ficha, "3.");
  bloqueHistorial(l, ficha, `4. ${T.ultimosRegistros}`, MAX_REGISTROS_RESUMEN_PDF);
  finalizar(l, encabezadoCorto(T.cortoResumen, ficha.codigo));
};

export const dibujarReceta = (doc: jsPDF, ficha: FichaPdf, receta: RecetaFicha, logo: string | null) => {
  const l = crearLienzo(doc);
  encabezado(l, logo, T.tituloReceta, `${ficha.codigo}-R${receta.id}`, ficha.emitida);
  bloquePaciente(l, ficha, "1.");
  tituloSeccion(l, `2. ${T.prescripcion}`);
  texto(l, T.emitidaPor(receta.veterinario, receta.centro, receta.fecha), { tam: 9 });
  l.y += 2;
  bloqueReceta(l, receta, false);
  firma(l, [T.firma, `${receta.veterinario} · ${T.colegiado(receta.colegiado)}`]);
  finalizar(l, encabezadoCorto(T.cortoReceta, ficha.codigo));
};
