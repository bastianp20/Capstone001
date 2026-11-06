import type { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { COLORES_PDF, MEDIDAS_PDF, TEXTOS_PDF as T } from "../../constants";
import type { LienzoPdf as Lienzo, OpcionesTextoPdf as OpcionesTexto, RgbPdf as Rgb } from "../../interfaces";

// =====================================================================
// Piezas genéricas para dibujar los PDF de AuraPet con jsPDF (en mm).
// No saben nada de fichas: solo texto, títulos, tablas, cajas y el
// marco/pie de cada página. Los bloques de la ficha están en bloques.ts.
// =====================================================================

export type { Lienzo };

export const MARGEN = MEDIDAS_PDF.margen;
const { marco: MARCO, inicioPaginas: INICIO_PAGINAS, reservaPie: RESERVA_PIE, ptAMm: PT_A_MM } = MEDIDAS_PDF;

export const crearLienzo = (doc: jsPDF): Lienzo => ({
  doc,
  y: MARGEN,
  ancho: doc.internal.pageSize.getWidth(),
  alto: doc.internal.pageSize.getHeight(),
});

export const anchoUtil = (l: Lienzo) => l.ancho - MARGEN * 2;

// jsPDF/autotable piden tuplas mutables
export const rgb = (c: Rgb): [number, number, number] => [c[0], c[1], c[2]];

const altoLinea = (tam: number) => tam * PT_A_MM * 1.35;

const fuente = (doc: jsPDF, tam: number, negrita: boolean, color: Rgb) => {
  doc.setFont("helvetica", negrita ? "bold" : "normal");
  doc.setFontSize(tam);
  doc.setTextColor(...rgb(color));
};

// Si lo que viene no cabe en la página, salta a una nueva
export const asegurarEspacio = (l: Lienzo, alto: number) => {
  if (l.y + alto > l.alto - RESERVA_PIE) {
    l.doc.addPage();
    l.y = INICIO_PAGINAS;
  }
};

export const espacio = (l: Lienzo, mm: number) => {
  l.y += mm;
};

// Cuántas líneas ocupa un texto en un ancho dado (para medir antes de dibujar)
export const medirLineas = (l: Lienzo, contenido: string, ancho: number, tam: number, negrita = false): string[] => {
  fuente(l.doc, tam, negrita, COLORES_PDF.texto);
  return l.doc.splitTextToSize(contenido, ancho) as string[];
};

// Párrafo que se corta solo en varias líneas y baja la "y"
export const texto = (l: Lienzo, contenido: string, opciones: OpcionesTexto = {}) => {
  const { x = MARGEN, ancho = anchoUtil(l), tam = 9.5, negrita = false, color = COLORES_PDF.texto } = opciones;
  const lineas = medirLineas(l, contenido, ancho, tam, negrita);
  const alto = lineas.length * altoLinea(tam);
  asegurarEspacio(l, alto);
  fuente(l.doc, tam, negrita, color);
  l.doc.text(lineas, x, l.y + altoLinea(tam) * 0.8);
  l.y += alto;
};

// "Etiqueta: valor" con la etiqueta en negrita; devuelve el alto usado
export const etiquetaValor = (l: Lienzo, etiqueta: string, valor: string, x: number, y: number, ancho: number, tam = 9.5) => {
  fuente(l.doc, tam, true, COLORES_PDF.texto);
  const anchoEtiqueta = l.doc.getTextWidth(etiqueta);
  l.doc.text(etiqueta, x, y + altoLinea(tam) * 0.8);
  const lineas = medirLineas(l, valor, Math.max(ancho - anchoEtiqueta, 20), tam);
  fuente(l.doc, tam, false, COLORES_PDF.texto);
  l.doc.text(lineas, x + anchoEtiqueta, y + altoLinea(tam) * 0.8);
  return lineas.length * altoLinea(tam);
};

// Encabezado de la primera página: logo + marca a la izquierda, título, código y fecha a la derecha
export const encabezado = (l: Lienzo, logo: string | null, titulo: string, codigo: string, emitida: string) => {
  const { doc } = l;
  const derecha = l.ancho - MARGEN;
  if (logo) doc.addImage(logo, "PNG", MARGEN, MARGEN - 2, 18, 18);
  fuente(doc, 13, true, COLORES_PDF.primario);
  doc.text(T.marca, MARGEN, MARGEN + 22);

  fuente(doc, 15, true, COLORES_PDF.texto);
  doc.text(titulo, derecha, MARGEN + 3, { align: "right" });
  fuente(doc, 12, true, COLORES_PDF.texto);
  doc.text(codigo, derecha, MARGEN + 10, { align: "right" });
  fuente(doc, 8.5, false, COLORES_PDF.muted);
  doc.text(emitida, derecha, MARGEN + 16, { align: "right" });
  doc.text(T.emitida, derecha, MARGEN + 20.5, { align: "right" });
  l.y = MARGEN + 32;
};

// "1. PACIENTE Y TUTOR" con una rayita verde debajo
export const tituloSeccion = (l: Lienzo, titulo: string) => {
  asegurarEspacio(l, 16);
  fuente(l.doc, 11.5, true, COLORES_PDF.texto);
  l.doc.text(titulo, MARGEN, l.y + 4);
  l.doc.setDrawColor(...rgb(COLORES_PDF.primario));
  l.doc.setLineWidth(0.7);
  l.doc.line(MARGEN, l.y + 6.5, MARGEN + 16, l.y + 6.5);
  l.y += 10;
};

// Tabla con encabezado verde suave; corta páginas y repite el encabezado
export const tabla = (l: Lienzo, columnas: string[], filas: string[][], anchos?: (number | "auto")[]) => {
  asegurarEspacio(l, 18);
  let fin = l.y;
  autoTable(l.doc, {
    startY: l.y,
    head: [columnas],
    body: filas,
    theme: "plain",
    margin: { left: MARGEN, right: MARGEN, top: INICIO_PAGINAS, bottom: RESERVA_PIE },
    styles: {
      font: "helvetica",
      fontSize: 9,
      textColor: rgb(COLORES_PDF.texto),
      cellPadding: 2,
      lineColor: rgb(COLORES_PDF.borde),
      lineWidth: { bottom: 0.2 },
      overflow: "linebreak",
    },
    headStyles: { fontStyle: "bold", fillColor: rgb(COLORES_PDF.secundario) },
    columnStyles: Object.fromEntries((anchos ?? []).map((w, i) => [i, { cellWidth: w }])),
    // La última celda dibujada marca dónde terminó la tabla
    didDrawCell: (dato) => { fin = dato.cell.y + dato.cell.height; },
  });
  l.y = fin + 6;
};

// Caja con fondo suave (para alertas): dibuja el fondo y deja la y lista para el contenido
export const caja = (l: Lienzo, alto: number, fondo: Rgb = COLORES_PDF.secundario) => {
  asegurarEspacio(l, alto);
  l.doc.setFillColor(...rgb(fondo));
  l.doc.roundedRect(MARGEN, l.y, anchoUtil(l), alto, 2.5, 2.5, "F");
};

// Triángulo de advertencia (icono de alerta), con un "!" blanco
export const iconoAlerta = (l: Lienzo, x: number, y: number, color: Rgb) => {
  l.doc.setFillColor(...rgb(color));
  l.doc.triangle(x, y + 4, x + 4.6, y + 4, x + 2.3, y, "F");
  fuente(l.doc, 7, true, [255, 255, 255]);
  l.doc.text("!", x + 2.3, y + 3.7, { align: "center" });
};

// Línea de firma (receta): a la derecha, con texto debajo
export const firma = (l: Lienzo, lineas: string[]) => {
  const y = Math.max(l.y + 24, l.alto - RESERVA_PIE - 16);
  if (y + 12 > l.alto - RESERVA_PIE + 8) {
    l.doc.addPage();
    l.y = INICIO_PAGINAS;
    firma(l, lineas);
    return;
  }
  const x2 = l.ancho - MARGEN;
  const x1 = x2 - 72;
  l.doc.setDrawColor(...rgb(COLORES_PDF.texto));
  l.doc.setLineWidth(0.3);
  l.doc.line(x1, y, x2, y);
  lineas.forEach((t, i) => {
    fuente(l.doc, i === 0 ? 8.5 : 8, i === 0, i === 0 ? COLORES_PDF.texto : COLORES_PDF.muted);
    l.doc.text(t, (x1 + x2) / 2, y + 4.5 + i * 4, { align: "center" });
  });
  l.y = y + 6 + lineas.length * 4;
};

// Al terminar: marco verde, encabezado corto (desde la página 2) y pie en todas las páginas
export const finalizar = (l: Lienzo, encabezadoCorto: string) => {
  const { doc } = l;
  const total = doc.getNumberOfPages();
  for (let pagina = 1; pagina <= total; pagina++) {
    doc.setPage(pagina);
    doc.setDrawColor(...rgb(COLORES_PDF.primario));
    doc.setLineWidth(0.8);
    doc.rect(MARCO, MARCO, l.ancho - MARCO * 2, l.alto - MARCO * 2);

    if (pagina > 1) {
      fuente(doc, 8.5, true, COLORES_PDF.primario);
      doc.text(T.marca, l.ancho - MARGEN - doc.getTextWidth(` | ${encabezadoCorto}`), MARCO + 10, { align: "right" });
      fuente(doc, 8.5, false, COLORES_PDF.muted);
      doc.text(` | ${encabezadoCorto}`, l.ancho - MARGEN, MARCO + 10, { align: "right" });
      doc.setDrawColor(...rgb(COLORES_PDF.borde));
      doc.setLineWidth(0.3);
      doc.line(MARGEN, MARCO + 13, l.ancho - MARGEN, MARCO + 13);
    }

    const yPie = l.alto - MARCO - 13;
    doc.setDrawColor(...rgb(COLORES_PDF.borde));
    doc.setLineWidth(0.3);
    doc.line(MARGEN, yPie - 3, l.ancho - MARGEN, yPie - 3);
    fuente(doc, 7, false, COLORES_PDF.muted);
    doc.text(doc.splitTextToSize(T.confidencial, anchoUtil(l) - 30) as string[], MARGEN, yPie + 1);
    fuente(doc, 8, true, COLORES_PDF.texto);
    doc.text(T.pagina(pagina, total), l.ancho - MARGEN, yPie + 1, { align: "right" });
  }
};
