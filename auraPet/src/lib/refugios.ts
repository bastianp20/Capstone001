import { MAX_MB_FOTO_ADOPCION, SECCIONES_SOLO_ADMIN_REFUGIO, TEXTOS_MODAL_REFUGIO as T, TIPOS_FOTO_ADOPCION } from "../constants";
import type {
  CampoRefugio,
  DatosEditarMiRefugio,
  DatosRefugio,
  DetalleMiRefugio,
  EspecieRefugio,
  ErroresFormulario,
  FiltrosRefugiosAdmin,
  ImagenRefugio,
  KpisRefugiosAdmin,
  Refugio,
  RefugioAdmin,
} from "../interfaces";
import { ocupacionRefugio } from "./publicacionesAdopcion";

// Cálculos de la gestión de refugios (superadmin y "Mi refugio"). Sin estado.

/** Saca los ítems de menú de "Mi refugio" cuando la persona no administra ninguno. */
export const filtrarMenuRefugio = <T,>(items: readonly T[], clave: (item: T) => string, conRefugio: boolean): T[] =>
  items.filter((i) => conRefugio || !SECCIONES_SOLO_ADMIN_REFUGIO.includes(clave(i)));

/** Porcentaje de ocupación (0–100) a partir de los dos números. */
export const porcentajeOcupacion = (ocupados: number, totales: number): number =>
  totales > 0 ? Math.min(100, Math.round((ocupados / totales) * 100)) : 0;

const normalizar = (texto: string) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const filtrarRefugiosAdmin = (lista: RefugioAdmin[], f: FiltrosRefugiosAdmin): RefugioAdmin[] => {
  const texto = normalizar(f.texto.trim());
  return lista.filter(
    (r) =>
      (f.incluirPrueba || !r.esPrueba) &&
      (f.estado === "todos" || r.estado === f.estado) &&
      (!f.region || r.region === f.region) &&
      (!texto || normalizar(`${r.nombre} ${r.comuna}`).includes(texto)),
  );
};

/** Números de arriba. Respetan "Incluir de prueba" (para no mezclar mundos). */
export const kpisRefugios = (lista: RefugioAdmin[], incluirPrueba: boolean): KpisRefugiosAdmin => {
  const considerados = lista.filter((r) => incluirPrueba || !r.esPrueba);
  const verificados = considerados.filter((r) => r.estado === "aprobado");
  const conCupos = verificados.filter((r) => r.cuposTotales > 0);
  return {
    verificados: verificados.length,
    porRevisar: considerados.filter((r) => r.estado === "pendiente").length,
    animales: considerados.reduce((n, r) => n + r.enAdopcion, 0),
    ocupacion: conCupos.length ? Math.round(conCupos.reduce((n, r) => n + ocupacionRefugio(r), 0) / conCupos.length) : 0,
  };
};

/** Imagen guardada (ruta + URL pública) para precargar el formulario. */
export const imagenGuardada = (ruta: string | null, url: string | null): ImagenRefugio => ({ ruta, archivo: null, vista: url });

/** ¿Se puede usar este archivo como logo o portada? Devuelve el error o null. */
export const errorImagenRefugio = (archivo: File): string | null =>
  !TIPOS_FOTO_ADOPCION.includes(archivo.type) || archivo.size > MAX_MB_FOTO_ADOPCION * 1024 * 1024 ? T.errorImagen : null;

/** Teléfono guardado (56912345678) → los 9 dígitos que se escriben en el campo. */
export const telefonoParaCampo = (telefono: number | null): string => (telefono ? String(telefono).replace(/^56/, "") : "");

/** Lo que escribió en el campo → número a guardar (con 56), o null. */
export const telefonoParaGuardar = (texto: string): number | null => {
  const digitos = texto.replace(/\D/g, "");
  return digitos ? Number(`56${digitos.slice(-9)}`) : null;
};

/** Un refugio de la lista → datos del formulario de edición. */
export const datosDesdeRefugio = (r: RefugioAdmin): DatosRefugio => ({
  nombre: r.nombre,
  region: r.region,
  comuna: r.comuna,
  telefono: telefonoParaCampo(r.telefono),
  correo: r.correo ?? "",
  descripcion: r.descripcion ?? "",
  logo: imagenGuardada(r.logoRuta, r.logoUrl),
  portada: imagenGuardada(r.portadaRuta, r.portadaUrl),
  cuposTotales: r.cuposTotales,
  cuposOcupados: r.cuposOcupados,
  recibe: r.recibe,
  especies: r.especies.filter((e): e is EspecieRefugio => e === "perro" || e === "gato" || e === "otro"),
  esPrueba: r.esPrueba,
  administradores: r.administradores,
});

/** Los datos del formulario → la tarjeta pública (para la vista previa en vivo). */
export const refugioDeVistaPrevia = (d: DatosRefugio, textos: { nombre: string; comuna: string }): Refugio => ({
  id: 0,
  nombre: d.nombre.trim() || textos.nombre,
  comuna: d.comuna.trim() || textos.comuna,
  region: d.region,
  descripcion: d.descripcion,
  logoUrl: d.logo.vista,
  portadaUrl: d.portada.vista,
  telefono: telefonoParaGuardar(d.telefono),
  correo: d.correo.trim() || null,
  cuposTotales: d.cuposTotales,
  cuposOcupados: d.cuposOcupados,
  recibe: d.recibe,
  especies: d.especies,
  enAdopcion: 0,
  fotos: [],
  aliados: 0,
});

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validarRefugio = (d: DatosRefugio): ErroresFormulario<CampoRefugio> => {
  const e: ErroresFormulario<CampoRefugio> = {};
  if (d.nombre.trim().length < 2) e.nombre = T.errorNombre;
  if (!d.region) e.region = T.errorRegion;
  if (!d.comuna.trim()) e.comuna = T.errorComuna;
  if (d.telefono.trim() && d.telefono.replace(/\D/g, "").length !== 9) e.telefono = T.errorTelefono;
  if (d.correo.trim() && !CORREO.test(d.correo.trim())) e.correo = T.errorCorreo;
  if (d.cuposOcupados > d.cuposTotales) e.cuposOcupados = T.errorCupos;
  if (!d.especies.length) e.especies = T.errorEspecies;
  if (d.administradores.some((a) => a.esPrueba !== d.esPrueba)) e.administradores = T.errorAdminsMundo;
  return e;
};

/** "Mi refugio" → lo que se puede editar. */
export const datosEdicionDesdeDetalle = (r: DetalleMiRefugio): DatosEditarMiRefugio => ({
  descripcion: r.descripcion ?? "",
  telefono: telefonoParaCampo(r.telefono),
  correo: r.correo ?? "",
  especies: r.especies.filter((e): e is EspecieRefugio => e === "perro" || e === "gato" || e === "otro"),
  logo: imagenGuardada(r.logoRuta, r.logoUrl),
  portada: imagenGuardada(r.portadaRuta, r.portadaUrl),
});

export const validarEdicionRefugio = (d: DatosEditarMiRefugio): ErroresFormulario<keyof DatosEditarMiRefugio> => {
  const e: ErroresFormulario<keyof DatosEditarMiRefugio> = {};
  if (d.telefono.trim() && d.telefono.replace(/\D/g, "").length !== 9) e.telefono = T.errorTelefono;
  if (d.correo.trim() && !CORREO.test(d.correo.trim())) e.correo = T.errorCorreo;
  if (!d.especies.length) e.especies = T.errorEspecies;
  return e;
};

/** Teléfono guardado (56987654321) → "+56 9 8765 4321" para mostrar. */
export const telefonoParaMostrar = (telefono: number): string => {
  const d = String(telefono).replace(/^56/, "");
  return d.length === 9 ? `+56 ${d[0]} ${d.slice(1, 5)} ${d.slice(5)}` : `+${telefono}`;
};
