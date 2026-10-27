import { ESTADO_DERIVACION_LABEL, TEXTOS_HISTORIAL, TIPO_REGISTRO_LABEL } from '@/constants/constants';
import type {
  Derivacion,
  FiltroHistorial,
  GrupoHistorial,
  ItemHistorial,
  Receta,
  RegistroMedico,
} from '@/interfaces';

import { formatFechaCorta, formatFechaLarga, formatMesAnio } from './fechas';

// Une registros, recetas y derivaciones en una sola línea de tiempo.

const desdeRegistro = (r: RegistroMedico): ItemHistorial => {
  const esVacuna = r.tipo === 'vacuna';
  return {
    clave: `registro-${r.id}`,
    tipo: esVacuna ? 'vacuna' : 'consulta',
    mascotaId: r.mascotaId,
    mascota: r.mascota,
    fecha: r.fecha,
    // Una vacuna se nombra por su descripción ("Antirrábica"); una consulta, por su tipo ("Control")
    titulo: `${esVacuna ? r.descripcion : TIPO_REGISTRO_LABEL[r.tipo]} · ${formatFechaCorta(r.fecha)}`,
    subtitulo: r.centro,
    detalle: esVacuna ? r.tratamiento : [r.descripcion, r.tratamiento].filter(Boolean).join('\n'),
    etiqueta: r.proximaDosis ? TEXTOS_HISTORIAL.proximaDosis(formatFechaLarga(r.proximaDosis)) : null,
    receta: null,
  };
};

const desdeReceta = (r: Receta): ItemHistorial => {
  const [primero] = r.medicamentos;
  return {
    clave: `receta-${r.id}`,
    tipo: 'receta',
    mascotaId: r.mascotaId,
    mascota: r.mascota,
    fecha: r.fecha,
    titulo: primero ? `${primero.nombre} · ${primero.dosis}` : `${TEXTOS_HISTORIAL.receta} · ${formatFechaCorta(r.fecha)}`,
    subtitulo: `${formatFechaCorta(r.fecha)} · ${TEXTOS_HISTORIAL.medicamentos(r.medicamentos.length)}`,
    detalle: r.indicaciones,
    etiqueta: r.proximoControl ? TEXTOS_HISTORIAL.proximoControl(formatFechaLarga(r.proximoControl)) : null,
    receta: r,
  };
};

const desdeDerivacion = (d: Derivacion): ItemHistorial => ({
  clave: `derivacion-${d.id}`,
  tipo: 'derivacion',
  mascotaId: d.mascotaId,
  mascota: d.mascota,
  fecha: d.fecha,
  titulo: TEXTOS_HISTORIAL.derivadoA(d.destino ?? '—'),
  subtitulo: [formatFechaCorta(d.fecha), d.origen ? TEXTOS_HISTORIAL.derivadoPor(d.origen) : null].filter(Boolean).join(' · '),
  detalle: [d.motivo, d.resultado].filter(Boolean).join('\n'),
  etiqueta: ESTADO_DERIVACION_LABEL[d.estado],
  receta: null,
});

export const armarLineaDeTiempo = (
  registros: RegistroMedico[],
  recetas: Receta[],
  derivaciones: Derivacion[],
): ItemHistorial[] =>
  [...registros.map(desdeRegistro), ...recetas.map(desdeReceta), ...derivaciones.map(desdeDerivacion)].sort((a, b) =>
    b.fecha.localeCompare(a.fecha),
  );

/** Agrupa por mes, manteniendo el orden (del más nuevo al más antiguo). */
export const agruparPorMes = (items: ItemHistorial[]): GrupoHistorial[] =>
  items.reduce<GrupoHistorial[]>((grupos, item) => {
    const titulo = formatMesAnio(item.fecha);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo?.titulo === titulo) ultimo.items.push(item);
    else grupos.push({ titulo, items: [item] });
    return grupos;
  }, []);

export const FILTROS_TIPO_HISTORIAL: Record<FiltroHistorial, (i: ItemHistorial) => boolean> = {
  todo: () => true,
  consulta: (i) => i.tipo === 'consulta',
  vacuna: (i) => i.tipo === 'vacuna',
  receta: (i) => i.tipo === 'receta',
  derivacion: (i) => i.tipo === 'derivacion',
};

export const camposBusquedaHistorial = (i: ItemHistorial) => [i.titulo, i.detalle, i.mascota];
