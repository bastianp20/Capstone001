import { AFINIDAD as A, TEXTOS_AFINIDAD as T } from "../constants";
import type { AfinidadPostulacion, FichaAdopcion, PostulacionRecibida, RazonAfinidad } from "../interfaces";

// Afinidad entre un animal y una postulación: una GUÍA para quien elige familia,
// calculada con lo que ya sabemos (rasgos del animal y respuestas del formulario).
// Parte de A.base y cada coincidencia suma o resta; nunca decide por la persona.

const alto = (v: number | null) => v !== null && v >= A.nivelAlto;
const bajo = (v: number | null) => v !== null && v <= A.nivelBajo;

/** Con qué rasgo comparar "otras mascotas": gatos, perros o el más bajo de ambos si no se sabe. */
const rasgoConMascotas = (animal: FichaAdopcion, cuales: string | null): number | null => {
  const texto = (cuales ?? "").toLowerCase();
  const { sociablePerros: perros, sociableGatos: gatos } = animal.rasgos;
  if (/gat/.test(texto) && !/perr/.test(texto)) return gatos;
  if (/perr/.test(texto) && !/gat/.test(texto)) return perros;
  const conocidos = [perros, gatos].filter((v): v is number => v !== null);
  return conocidos.length ? Math.min(...conocidos) : null;
};

export const calcularAfinidad = (animal: FichaAdopcion, p: PostulacionRecibida): AfinidadPostulacion => {
  let puntos: number = A.base;
  const razones: RazonAfinidad[] = [];
  const sumar = (delta: number, texto: string) => {
    puntos += delta;
    razones.push({ tipo: delta >= 0 ? "ok" : "alerta", texto });
  };
  const n = animal.nombre;
  const { energia, sociableNinos } = animal.rasgos;

  if (p.hayNinos) {
    if (alto(sociableNinos)) sumar(A.ninosBien, T.ninosBien(n, p.edadesNinos));
    else if (bajo(sociableNinos)) sumar(A.ninosMal, T.ninosMal(n));
  }
  if (p.otrasMascotas) {
    const rasgo = rasgoConMascotas(animal, p.cualesMascotas);
    if (alto(rasgo)) sumar(A.mascotasBien, T.mascotasBien(n));
    else if (bajo(rasgo)) sumar(A.mascotasMal, T.mascotasMal(n));
  }
  if (alto(energia)) {
    if (p.tienePatio) sumar(A.energiaConPatio, T.energiaConPatio(n));
    else sumar(A.energiaSinPatio, T.energiaSinPatio(n));
  }
  if (animal.tamano === "grande" && p.vivienda === "departamento") sumar(A.grandeEnDepto, T.grandeEnDepto(n));
  if (p.tenencia === "arrendada") {
    if (p.permitenMascotas) sumar(A.permitenMascotas, T.permitenMascotas);
    else if (p.permitenMascotas === false) sumar(A.noPermitenMascotas, T.noPermitenMascotas);
  }
  if (p.todosDeAcuerdo) sumar(A.todosDeAcuerdo, T.todosDeAcuerdo);
  else sumar(A.noTodosDeAcuerdo, T.noTodosDeAcuerdo);
  if (p.experiencia?.trim()) sumar(A.experiencia, T.experiencia);

  // Primero lo bueno, después lo que conviene conversar
  razones.sort((a, b) => (a.tipo === b.tipo ? 0 : a.tipo === "ok" ? -1 : 1));
  return { porcentaje: Math.max(A.minimo, Math.min(A.maximo, Math.round(puntos))), razones };
};
