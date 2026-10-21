import {
  COLORES_PDF, ESTADO_DERIVACION, ESTADO_VACUNA, MAX_CARACTERES_RESUMEN_PDF, TEXTOS_PDF as T, TIPO_REGISTRO_LABEL,
} from "../../constants";
import { formatFechaLarga } from "../fechas";
import type { FichaPdf, RecetaFicha, RegistroFicha } from "../../interfaces";
import {
  MARGEN, anchoUtil, asegurarEspacio, caja, espacio, etiquetaValor, iconoAlerta, medirLineas, rgb, tabla, texto,
  tituloSeccion, type Lienzo,
} from "./plantilla";

// =====================================================================
// Bloques de la ficha médica (los usan la ficha completa, el resumen y
// la receta). Cada uno dibuja su sección y deja la "y" debajo.
// =====================================================================

const recortar = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

// 1. Paciente y tutor: tres columnas de "Etiqueta: valor" (paciente en dos, tutor en la tercera)
export const bloquePaciente = (l: Lienzo, ficha: FichaPdf, numero: string) => {
  const c = T.campos;
  const p = ficha.paciente;
  const columnas: [string, string][][] = [
    [[c.nombre, p.nombre], [c.especie, p.especie], [c.raza, p.raza], [c.sexo, p.sexo]],
    [[c.nacimiento, p.nacimiento], [c.peso, p.peso], [c.esterilizado, p.esterilizado], [c.microchip, p.microchip]],
    [[c.tutor, ficha.tutor.nombre], [c.telefono, ficha.tutor.telefono]],
  ];

  tituloSeccion(l, `${numero} ${T.pacienteTutor}`);
  const separacion = 6;
  const anchoColumna = (anchoUtil(l) - separacion * (columnas.length - 1)) / columnas.length;
  asegurarEspacio(l, 24);
  const finales = columnas.map((pares, i) => {
    const x = MARGEN + i * (anchoColumna + separacion);
    return pares.reduce((y, [e, v]) => y + etiquetaValor(l, e, v, x, y, anchoColumna) + 0.8, l.y);
  });
  l.y = Math.max(...finales) + 5;
};

// 2. Alertas clínicas: caja suave con triángulos rojo (alergias) y ámbar (condiciones)
export const bloqueAlertas = (l: Lienzo, ficha: FichaPdf, numero: string) => {
  tituloSeccion(l, `${numero} ${T.alertas}`);
  const items = [
    ficha.alergias ? { etiqueta: T.alergia, valor: ficha.alergias, color: COLORES_PDF.rojo } : null,
    ficha.condicionesCronicas ? { etiqueta: T.condicion, valor: ficha.condicionesCronicas, color: COLORES_PDF.ambar } : null,
  ].filter((i) => i !== null);

  const anchoTexto = anchoUtil(l) - 16;
  const altos = items.map((i) => medirLineas(l, `${i.etiqueta}${i.valor}`, anchoTexto, 9.5).length * 4.6);
  const alto = items.length === 0 ? 11 : altos.reduce((a, b) => a + b, 0) + (items.length - 1) * 2.5 + 8;
  caja(l, alto);

  if (items.length === 0) {
    const y0 = l.y;
    l.y += 3.5;
    texto(l, T.sinAlertas, { x: MARGEN + 5, color: COLORES_PDF.muted });
    l.y = y0 + alto + 6;
    return;
  }
  let y = l.y + 4;
  items.forEach((i, n) => {
    iconoAlerta(l, MARGEN + 4, y + 0.4, i.color);
    etiquetaValor(l, i.etiqueta, i.valor, MARGEN + 11, y, anchoTexto);
    y += altos[n] + 2.5;
  });
  l.y += alto + 6;
};

// 3. Vacunas: tabla con estado (Al día / Por vencer / Vencida)
export const bloqueVacunas = (l: Lienzo, ficha: FichaPdf, numero: string) => {
  tituloSeccion(l, `${numero} ${T.vacunas}`);
  if (ficha.vacunas.length === 0) {
    texto(l, T.sinVacunas, { color: COLORES_PDF.muted });
    espacio(l, 5);
    return;
  }
  tabla(l, T.columnasVacunas, ficha.vacunas.map((v) => [v.nombre, v.aplicada, v.proximaDosis, ESTADO_VACUNA[v.estado].texto]));
};

// Un registro del historial como tarjeta gris con un punto verde a la izquierda (línea de tiempo)
const tarjetaRegistro = (l: Lienzo, r: RegistroFicha, compacta: boolean) => {
  const x = MARGEN + 8;
  const ancho = anchoUtil(l) - 8;
  const anchoTexto = ancho - 8;
  const cabecera = [r.fecha, TIPO_REGISTRO_LABEL[r.tipo].toUpperCase(), [r.veterinario, r.centro && `(${r.centro})`].filter(Boolean).join(" ")]
    .filter(Boolean).join(" - ");
  const descripcion = compacta ? recortar(r.descripcion, MAX_CARACTERES_RESUMEN_PDF) : r.descripcion;
  const extras: [string, string][] = compacta ? [] : [
    ...(r.tratamiento ? [[T.tratamiento, r.tratamiento] as [string, string]] : []),
    ...(r.proximaDosis ? [[T.proximaDosis, formatFechaLarga(r.proximaDosis)] as [string, string]] : []),
  ];

  const lh = 4.5;
  const relleno = compacta ? 3 : 4;
  const altoCabecera = medirLineas(l, cabecera, anchoTexto, 9.5, true).length * lh;
  const altoDescripcion = medirLineas(l, descripcion, anchoTexto, 9.5).length * lh;
  const altoExtras = extras.reduce((a, [e, v]) => a + medirLineas(l, `${e}${v}`, anchoTexto, 9.5).length * lh + 1, 0);
  const alto = relleno + altoCabecera + 1.5 + altoDescripcion + (extras.length ? 1.5 + altoExtras : 0) + relleno - 1;

  asegurarEspacio(l, alto + 4);
  const { doc } = l;
  // Línea de tiempo
  doc.setDrawColor(...rgb(COLORES_PDF.primario));
  doc.setLineWidth(0.5);
  doc.line(MARGEN + 3, l.y + 2, MARGEN + 3, l.y + alto + 4);     // llega hasta la tarjeta siguiente
  doc.setFillColor(...rgb(COLORES_PDF.primario));
  doc.circle(MARGEN + 3, l.y + 5, 1.6, "F");
  // Tarjeta
  doc.setFillColor(...rgb(COLORES_PDF.tarjeta));
  doc.roundedRect(x, l.y, ancho, alto, 2, 2, "F");

  const y0 = l.y;
  l.y += relleno;
  texto(l, cabecera, { x: x + 4, ancho: anchoTexto, negrita: true });
  l.y += 1.5;
  texto(l, descripcion, { x: x + 4, ancho: anchoTexto });
  if (extras.length) {
    l.y += 1.5;
    extras.forEach(([e, v]) => { l.y += etiquetaValor(l, e, v, x + 4, l.y, anchoTexto) + 1; });
  }
  l.y = y0 + alto + (compacta ? 3 : 4);
};

// 4. Historial médico: todas las tarjetas (o las últimas N en el resumen)
export const bloqueHistorial = (l: Lienzo, ficha: FichaPdf, titulo: string, maximo?: number) => {
  tituloSeccion(l, titulo);
  if (ficha.historial.length === 0) {
    texto(l, T.sinHistorial, { color: COLORES_PDF.muted });
    espacio(l, 5);
    return;
  }
  const compacta = maximo !== undefined;
  (compacta ? ficha.historial.slice(0, maximo) : ficha.historial).forEach((r) => tarjetaRegistro(l, r, compacta));
  espacio(l, 2);
};

// Una receta: quién y cuándo, tabla de medicamentos, indicaciones y próximo control
export const bloqueReceta = (l: Lienzo, receta: RecetaFicha, conCabecera: boolean) => {
  if (conCabecera) {
    asegurarEspacio(l, 26);
    texto(l, `${receta.fecha} · ${receta.veterinario}${receta.centro ? ` (${receta.centro})` : ""}`, { negrita: true });
    espacio(l, 1.5);
  }
  tabla(l, T.columnasMedicamentos, receta.medicamentos.map((m) => [m.nombre, m.dosis, m.frecuencia, m.duracion]));
  if (receta.indicaciones) {
    asegurarEspacio(l, 6);
    l.y += etiquetaValor(l, T.indicaciones, receta.indicaciones, MARGEN, l.y, anchoUtil(l)) + 1;
  }
  if (receta.proximoControl) {
    asegurarEspacio(l, 6);
    l.y += etiquetaValor(l, T.proximoControl, receta.proximoControl, MARGEN, l.y, anchoUtil(l)) + 1;
  }
  espacio(l, 5);
};

// 5. Recetas
export const bloqueRecetas = (l: Lienzo, ficha: FichaPdf, numero: string) => {
  tituloSeccion(l, `${numero} ${T.recetas}`);
  if (ficha.recetas.length === 0) {
    texto(l, T.sinRecetas, { color: COLORES_PDF.muted });
    espacio(l, 5);
    return;
  }
  ficha.recetas.forEach((r) => bloqueReceta(l, r, true));
};

// 6. Derivaciones
export const bloqueDerivaciones = (l: Lienzo, ficha: FichaPdf, numero: string) => {
  tituloSeccion(l, `${numero} ${T.derivaciones}`);
  if (ficha.derivaciones.length === 0) {
    texto(l, T.sinDerivaciones, { color: COLORES_PDF.muted });
    espacio(l, 5);
    return;
  }
  tabla(
    l,
    T.columnasDerivaciones,
    ficha.derivaciones.map((d) => [d.fecha, d.origen, d.destino, d.motivo, ESTADO_DERIVACION[d.estado].texto, d.resultado ?? "—"]),
    [20, 28, 28, "auto", 20, "auto"],
  );
};
